import React from 'react';

export const QuizSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-[2rem] border border-slate-200 shadow-lg overflow-hidden">
          <div className="aspect-video bg-slate-200" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded-full w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded-full w-full" />
              <div className="h-3 bg-slate-100 rounded-full w-5/6" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="h-4 bg-slate-100 rounded-full w-24" />
              <div className="h-4 bg-slate-100 rounded-full w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
