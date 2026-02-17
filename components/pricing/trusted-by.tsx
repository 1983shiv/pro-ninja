import { Database, Infinity, Code2, Rocket } from 'lucide-react';

export function TrustedBy() {
  const companies = [
    { name: 'DataFlow', icon: Database },
    { name: 'InfiniteWP', icon: Infinity },
    { name: 'CodeCraft', icon: Code2 },
    { name: 'LaunchPad', icon: Rocket },
  ];

  return (
    <div className="text-center my-20">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Trusted by WordPress Developers</h2>
      <div className="flex justify-center gap-8 flex-wrap opacity-50 grayscale">
        {companies.map((company) => {
          const Icon = company.icon;
          return (
            <div key={company.name} className="font-bold text-xl flex items-center gap-2">
              <Icon className="w-6 h-6" />
              {company.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
