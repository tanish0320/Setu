import React from 'react';
import { useApp } from '../context/AppContext';

export const DemoConsole = () => {
  const {
    demoActive,
    demoStep, setDemoStep,
    demoNarrative,
    demoSpeed, setDemoSpeed,
    demoPaused, setDemoPaused,
    startWowDemo, stopWowDemo,
    stepForward, stepBackward
  } = useApp();

  if (!demoActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={startWowDemo}
          className="bg-brand hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg shadow-brand-500/25 flex items-center space-x-2 animate-bounce font-headline"
        >
          <span className="material-symbols-outlined text-sm">play_arrow</span>
          <span>LAUNCH INTERACTIVE DEMO STORY</span>
        </button>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Consultation' },
    { num: 2, label: 'SOS Alert' },
    { num: 3, label: 'AI Ranks' },
    { num: 4, label: 'Accepts' },
    { num: 5, label: 'Commuting' },
    { num: 6, label: 'Arrived' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border border-brand-500/30 w-[420px] rounded-premium shadow-2xl overflow-hidden p-4 space-y-3.5 animate-fade-in text-left font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-border/40">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></span>
          <span className="text-xs font-black text-slate-800 dark:text-white font-headline uppercase tracking-wider">SETU Demo Controller</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-mono font-bold">Step {demoStep}/6</span>
          <button
            onClick={stopWowDemo}
            className="text-slate-400 hover:text-danger hover:scale-115 transition-transform"
          >
            <span className="material-symbols-outlined text-md font-bold">close</span>
          </button>
        </div>
      </div>

      {/* Narrative block */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-100 dark:border-dark-border/30 rounded text-[11px] leading-relaxed text-slate-650 dark:text-slate-300 font-semibold min-h-[50px] flex items-center">
        {demoNarrative || 'Preparing storyboard engine...'}
      </div>

      {/* Interactive Timeline Scrubbing */}
      <div className="flex justify-between items-center gap-1.5 relative py-1">
        {stepsList.map(step => {
          const isActive = demoStep === step.num;
          const isDone = demoStep > step.num;
          return (
            <button
              key={step.num}
              onClick={() => { if (setDemoStep) setDemoStep(step.num); }}
              className="flex-1 text-center group focus:outline-none"
              title={`Scrub to ${step.label}`}
            >
              <div className={`h-1.5 rounded-full transition-all ${
                isDone ? 'bg-success' : 
                isActive ? 'bg-brand scale-y-110 shadow-sm' : 
                'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-350'
              }`}></div>
              <span className={`text-[8.5px] font-bold mt-1.5 block leading-none truncate transition-colors ${
                isActive ? 'text-brand font-black' : 
                isDone ? 'text-success' : 'text-slate-400 group-hover:text-slate-500'
              }`}>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Controllers: Play/Pause, Step Back/Forward, Restart */}
      <div className="flex justify-between items-center border-t border-slate-100 dark:border-dark-border/40 pt-3 text-xs">
        
        {/* Playback Control Panel */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => stepBackward()}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-300"
            title="Step Backward"
          >
            <span className="material-symbols-outlined text-sm font-bold block">skip_previous</span>
          </button>
          
          <button
            onClick={() => setDemoPaused(!demoPaused)}
            className="px-3 py-1 bg-brand hover:bg-brand-600 text-white rounded font-bold transition-colors flex items-center space-x-1"
          >
            <span className="material-symbols-outlined text-sm font-bold">
              {demoPaused ? 'play_arrow' : 'pause'}
            </span>
            <span>{demoPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={() => stepForward()}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-300"
            title="Step Forward"
          >
            <span className="material-symbols-outlined text-sm font-bold block">skip_next</span>
          </button>

          <button
            onClick={() => startWowDemo()}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 rounded transition-colors text-slate-600 dark:text-slate-300 ml-1"
            title="Restart Timeline"
          >
            <span className="material-symbols-outlined text-sm font-bold block">restart_alt</span>
          </button>
        </div>

        {/* Speed dials */}
        <div className="flex items-center space-x-1">
          {[1, 2, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => setDemoSpeed(s)}
              className={`px-2 py-0.5 rounded font-mono text-[9.5px] font-bold transition-colors ${
                demoSpeed === s 
                  ? 'bg-brand text-white' 
                  : 'bg-slate-50 dark:bg-slate-850 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};
