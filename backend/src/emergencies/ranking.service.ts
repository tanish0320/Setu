import { Injectable, NotFoundException } from '@nestjs/common';
import { EmergenciesRepository } from './emergencies.repository';

export interface ScoreComponents {
  distanceScore: number;
  availabilityScore: number;
  specialtyScore: number;
  historyScore: number;
}

export interface RankedDoctor {
  doctorId: string;
  doctor: any;
  score: number;
  rank: number;
  explanation: string;
  scoreComponents: ScoreComponents;
}

@Injectable()
export class RankingService {
  constructor(private readonly repository: EmergenciesRepository) {}

  async rankDoctors(hospitalId: string, specialty: string): Promise<RankedDoctor[]> {
    const requestingHospital = await this.repository.findHospitalById(hospitalId);
    if (!requestingHospital) {
      throw new NotFoundException(`Hospital with ID ${hospitalId} not found`);
    }

    const doctors = await this.repository.findDoctorsForRanking(specialty);
    const eligibleDoctorsWithScores: Omit<RankedDoctor, 'rank'>[] = [];

    const activeStatuses = ['Searching', 'Alerting', 'Accepted', 'Travelling'];

    for (const doc of doctors) {
      // 1. User profile active and not deleted
      if (!doc.user || !doc.user.isActive || doc.user.deletedAt !== null) {
        continue;
      }

      // 2. Doctor not deleted
      if (doc.deletedAt !== null) {
        continue;
      }

      // 3. Opt-in for emergencies
      if (!doc.emergencyOptIn) {
        continue;
      }

      // 4. Specialty match (already filtered in query, but double check)
      if (doc.specialty.toLowerCase() !== specialty.toLowerCase()) {
        continue;
      }

      // 5. No appointment in "In Progress" status
      if (doc.appointments.length > 0) {
        continue;
      }

      // 6. Not currently alerted/accepted on another active emergency
      const hasActiveAssignment = doc.emergencyAssignments.some((assignment) => {
        const reqStatus = assignment.emergencyRequest?.status;
        if (!reqStatus) return false;
        const isReqActive = activeStatuses.includes(reqStatus);
        const isAssignmentActive = assignment.status === 'Alerted' || assignment.status === 'Accepted';
        return isReqActive && isAssignmentActive;
      });

      if (hasActiveAssignment) {
        continue;
      }

      // 7. Resolve location (current or primary or first affiliation)
      let docHospital = null;
      if (doc.status && doc.status.currentHospitalId) {
        const currentHospId = doc.status.currentHospitalId;
        const affiliation = doc.hospitals.find((h) => h.hospitalId === currentHospId);
        if (affiliation) {
          docHospital = affiliation.hospital;
        } else {
          docHospital = await this.repository.findHospitalById(currentHospId);
        }
      }

      if (!docHospital) {
        const primaryAff = doc.hospitals.find((h) => h.isPrimary);
        if (primaryAff) {
          docHospital = primaryAff.hospital;
        }
      }

      if (!docHospital && doc.hospitals.length > 0) {
        docHospital = doc.hospitals[0].hospital;
      }

      if (!docHospital) {
        // Ineligible if no location can be established
        continue;
      }

      // 8. Distance calculation
      const dx = docHospital.x - requestingHospital.x;
      const dy = docHospital.y - requestingHospital.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const travelTime = distance * 2;

      // Requesting hospital must be within travelRadius
      if (travelTime > doc.travelRadius) {
        continue;
      }

      // Distance Score (40%)
      let distanceScore = 0;
      if (travelTime <= 5) {
        distanceScore = 100;
      } else if (travelTime >= doc.travelRadius) {
        distanceScore = 0;
      } else {
        const den = doc.travelRadius - 5;
        distanceScore = den <= 0 ? 100 : ((doc.travelRadius - travelTime) / den) * 100;
      }
      distanceScore = Math.max(0, Math.min(100, distanceScore));

      // Availability Score (35%)
      const docStatusStr = doc.status?.status;
      let availabilityScore = 0;
      if (docStatusStr === 'Available') {
        availabilityScore = 100;
      } else if (docStatusStr === 'Consulting' || docStatusStr === 'On Break') {
        availabilityScore = 50;
      } else {
        availabilityScore = 0;
      }

      // Specialty Match (15%)
      const specialtyScore = 100; // already matched

      // Response History (10%)
      const acceptedCount = doc.emergencyAssignments.filter((a) => a.status === 'Accepted').length;
      const declinedCount = doc.emergencyAssignments.filter((a) => a.status === 'Declined').length;
      const timeoutCount = doc.emergencyAssignments.filter((a) => a.status === 'Timeout').length;
      const historyTotal = acceptedCount + declinedCount + timeoutCount;
      const historyScore = historyTotal === 0 ? 80 : (acceptedCount / historyTotal) * 100;

      // Weighted Total Score
      const totalScore =
        distanceScore * 0.4 +
        availabilityScore * 0.35 +
        specialtyScore * 0.15 +
        historyScore * 0.1;

      const explanation =
        `Distance Score: ${distanceScore.toFixed(1)} (40%), ` +
        `Availability Score: ${availabilityScore.toFixed(1)} (35%), ` +
        `Specialty Match Score: ${specialtyScore.toFixed(1)} (15%), ` +
        `Response History Score: ${historyScore.toFixed(1)} (10%). ` +
        `Travel Time: ${travelTime.toFixed(1)} mins.`;

      eligibleDoctorsWithScores.push({
        doctorId: doc.id,
        doctor: doc,
        score: totalScore,
        explanation,
        scoreComponents: {
          distanceScore,
          availabilityScore,
          specialtyScore,
          historyScore,
        },
      });
    }

    // Sort by total score descending
    const sorted = eligibleDoctorsWithScores.sort((a, b) => b.score - a.score);

    // Map to RankedDoctor with rank positions (1-based)
    return sorted.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }
}
