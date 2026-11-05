import React, { useState } from 'react';
import { Briefcase, TrendingUp, Award, Clock, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../../audio/soundEngine';

interface Job {
  id: string;
  title: string;
  category: 'Street Hustle' | 'Commercial' | 'Corporate' | 'Petroleum & Governance';
  hourlyPayNaira: number;
  dailySalaryNaira: number;
  requiredReputation: number;
  description: string;
  shiftDurationSeconds: number;
}

export const JOBS_LIST: Job[] = [
  {
    id: 'job_kurmi_trader',
    title: 'Kurmi Market Spices & Textile Merchant',
    category: 'Street Hustle',
    hourlyPayNaira: 45000,
    dailySalaryNaira: 350000,
    requiredReputation: 0,
    description: 'Hustle on the ground in ancient Kurmi Market selling authentic northern brocade and Sahel spices.',
    shiftDurationSeconds: 6,
  },
  {
    id: 'job_keke_fleet',
    title: 'Kano Commercial Keke Napep Fleet Manager',
    category: 'Commercial',
    hourlyPayNaira: 120000,
    dailySalaryNaira: 950000,
    requiredReputation: 25,
    description: 'Manage a fleet of 25 yellow-and-green tricycles connecting Sabon Gari to Fagge and Nassarawa.',
    shiftDurationSeconds: 8,
  },
  {
    id: 'job_agritech_ceo',
    title: 'Bompai Industrial Commodity Trader',
    category: 'Corporate',
    hourlyPayNaira: 500000,
    dailySalaryNaira: 4200000,
    requiredReputation: 50,
    description: 'Structure grain silos, groundnut processing, and export logistics to the Sahel and Mediterranean.',
    shiftDurationSeconds: 10,
  },
  {
    id: 'job_oil_marketer',
    title: 'Petroleum Depots & Maritime Logistics Director',
    category: 'Petroleum & Governance',
    hourlyPayNaira: 1800000,
    dailySalaryNaira: 15000000,
    requiredReputation: 75,
    description: 'Direct crude oil allocations and tank farms spanning Port Harcourt, Lagos port, and Kano inland terminal.',
    shiftDurationSeconds: 12,
  },
  {
    id: 'job_state_commissioner',
    title: 'Kano State Commissioner for Infrastructure & Finance',
    category: 'Petroleum & Governance',
    hourlyPayNaira: 5000000,
    dailySalaryNaira: 45000000,
    requiredReputation: 90,
    description: 'Cabinet principal officer presiding over state budgets, airport expansion, and international trade treaties.',
    shiftDurationSeconds: 15,
  },
];

interface JobsAppProps {
  currentJobId: string;
  reputation: number;
  onSetJob: (jobId: string) => void;
  onEarnSalary: (amount: number) => void;
}

export const JobsApp: React.FC<JobsAppProps> = ({
  currentJobId,
  reputation,
  onSetJob,
  onEarnSalary,
}) => {
  const [activeJob, setActiveJob] = useState<Job>(
    JOBS_LIST.find((j) => j.id === currentJobId) || JOBS_LIST[0]
  );
  const [isWorkingShift, setIsWorkingShift] = useState(false);
  const [shiftProgress, setShiftProgress] = useState(0);

  const handleStartShift = () => {
    if (isWorkingShift) return;
    setIsWorkingShift(true);
    setShiftProgress(0);
    soundEngine.playPhoneChime();

    const duration = activeJob.shiftDurationSeconds * 1000;
    const intervalTime = 100;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setShiftProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setIsWorkingShift(false);
          onEarnSalary(activeJob.dailySalaryNaira);
          soundEngine.playCashSound();
          return 0;
        }
        return p + step;
      });
    }, intervalTime);
  };

  const handleApply = (job: Job) => {
    if (reputation < job.requiredReputation) {
      alert(`Requires at least ${job.requiredReputation}% Kano reputation!`);
      return;
    }
    setActiveJob(job);
    onSetJob(job.id);
    soundEngine.playPhoneChime();
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-white select-none">
      <div className="p-3 bg-zinc-900 border-b border-zinc-800">
        <h2 className="text-xs font-black tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>KANO CAREERS & EMPIRE HUSTLE</span>
        </h2>
        <p className="text-[10px] text-zinc-400">
          Climb from street market vendor to Oil & State Commissioner
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Active Job Card */}
        <div className="p-3 bg-gradient-to-br from-zinc-900 to-amber-950/40 border border-amber-500/30 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase">
              Current Employment Status
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              ACTIVE CAREER
            </span>
          </div>

          <div>
            <h3 className="text-xs font-black text-white">{activeJob.title}</h3>
            <div className="text-[11px] text-zinc-400 mt-0.5">{activeJob.description}</div>
          </div>

          <div className="flex justify-between items-center text-xs py-1.5 px-2.5 bg-zinc-950/70 rounded-lg border border-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-400">Shift Payout: </span>
              <strong className="text-emerald-400 font-mono">
                +₦{activeJob.dailySalaryNaira.toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400">Required Clout: </span>
              <strong className="text-amber-400">{activeJob.requiredReputation}%</strong>
            </div>
          </div>

          {isWorkingShift && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-400">
                <span>Working shift & hustle in progress...</span>
                <span className="font-bold text-amber-400">{Math.round(shiftProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
                  style={{ width: `${shiftProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleStartShift}
            disabled={isWorkingShift}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
              isWorkingShift
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isWorkingShift ? 'Working On-Site...' : 'Clock In & Hustle (Collect ₦ Pay)'}</span>
          </button>
        </div>

        {/* All Available Career Openings */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-zinc-300">Available Career Vacancies:</div>
          {JOBS_LIST.map((job) => {
            const isCurrent = activeJob.id === job.id;
            const meetsClout = reputation >= job.requiredReputation;

            return (
              <div
                key={job.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-zinc-900 border-amber-500/50'
                    : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {job.category}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-100 mt-1">{job.title}</h4>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{job.description}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-zinc-800/80">
                  <div className="text-xs font-black text-emerald-400">
                    ₦{job.dailySalaryNaira.toLocaleString()}/shift
                  </div>

                  {isCurrent ? (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={!meetsClout}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        meetsClout
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {meetsClout ? 'Apply & Take Job' : `Needs ${job.requiredReputation}% Rep`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
