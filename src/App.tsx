import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster, toast } from "sonner";

interface Club {
  clubName: string;
  description: string;
}

export default function App() {
  const [formData, setFormData] = useState({
    submitterName: "",
    submitterEmail: "",
    submitterSchoolEmail: "",
  });
  const [clubs, setClubs] = useState<Club[]>([{ clubName: "", description: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMultipleClubs = useMutation(api.clubs.submitMultipleClubs);
  const allClubs = useQuery(api.clubs.getAllClubs) || [];
  const clubsCount = useQuery(api.clubs.getClubsCount) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.submitterName || !formData.submitterEmail || !formData.submitterSchoolEmail) {
      toast.error("Please fill in all personal information fields");
      return;
    }

    // Validate school email
    if (!formData.submitterSchoolEmail.endsWith("@g.gcpsk12.org")) {
      toast.error("School email must end with @g.gcpsk12.org");
      return;
    }

    // Validate clubs
    const validClubs = clubs.filter(club => club.clubName.trim() && club.description.trim());
    if (validClubs.length === 0) {
      toast.error("Please add at least one club with both name and description");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitMultipleClubs({
        clubs: validClubs,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,
        submitterSchoolEmail: formData.submitterSchoolEmail,
      });

      if (result.success) {
        toast.success(`Successfully submitted ${result.totalSubmitted} club${result.totalSubmitted !== 1 ? 's' : ''}!`);
        if (result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
        
        // Reset form
        setFormData({
          submitterName: "",
          submitterEmail: "",
          submitterSchoolEmail: "",
        });
        setClubs([{ clubName: "", description: "" }]);
      } else {
        toast.error("Failed to submit clubs. Please try again.");
        result.errors.forEach(error => toast.error(error));
      }
    } catch (error) {
      toast.error("Failed to submit clubs. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClubChange = (index: number, field: keyof Club, value: string) => {
    const updatedClubs = [...clubs];
    updatedClubs[index] = { ...updatedClubs[index], [field]: value };
    setClubs(updatedClubs);
  };

  const addClub = () => {
    setClubs([...clubs, { clubName: "", description: "" }]);
  };

  const removeClub = (index: number) => {
    if (clubs.length > 1) {
      const updatedClubs = clubs.filter((_, i) => i !== index);
      setClubs(updatedClubs);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Hero combined */}
      <header className="relative overflow-hidden pb-10 pt-16 animate-fade-in">
        <div className="absolute inset-0 opacity-60 bg-gradient-brand-linear" />
        <div className="absolute inset-0 bg-gradient-radial-gold mix-blend-overlay" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-radial-green" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight gradient-text-brand drop-shadow-sm mb-4 animate-rise">
              Grayson High School
            </h1>
            <p className="text-lg md:text-2xl font-semibold gradient-text-gold mb-8">
              Inside Scoop Club Bingo Challenge
            </p>
            <div className="max-w-3xl mx-auto card-glass card-glow-border p-8 md:p-10 animate-rise">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-grayson-gold via-grayson-green to-grayson-navy shadow-brand-soft flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-grayson-navy mb-4">
                Help Build Our Club Bingo Card!
              </h2>
              <p className="text-base md:text-lg text-grayson-navy/80 leading-relaxed">
                Know awesome clubs at Grayson High School? Submit them below to be featured on the interactive bingo card. Explore different clubs, join new communities, and complete your card for prizes.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-grayson-navy-soft/40 border border-white/30 px-5 py-4 backdrop-blur-sm flex flex-col items-center text-center">
                  <span className="badge-gold mb-2">Live Count</span>
                  <p className="text-sm font-medium text-grayson-navy">Total Clubs Submitted</p>
                  <p className="text-3xl font-extrabold gradient-text-gold mt-1 tabular-nums">{clubsCount}</p>
                </div>
                <div className="rounded-xl bg-grayson-green-soft/40 border border-white/30 px-5 py-4 backdrop-blur-sm flex flex-col items-center text-center">
                  <span className="badge-gold mb-2">NHS</span>
                  <p className="text-sm font-medium text-grayson-navy">Sponsored Rewards</p>
                  <p className="text-xs mt-1 text-grayson-navy/70">Complete your bingo card and claim exclusive prizes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Submission Form */}
      <section className="relative py-20 px-6 lg:px-10">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-grayson-gold-soft/20 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <div className="card-glass card-glow-border p-8 md:p-10 animate-rise">
            <h3 className="text-2xl md:text-3xl font-bold text-grayson-navy text-center mb-8">
              Submit Club(s)
            </h3>
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-grayson-navy tracking-wide">Your Information</h4>
                  <div className="flex-1 divider-soft" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label htmlFor="submitterName" className="block text-xs font-semibold uppercase tracking-wider text-grayson-navy/70 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="submitterName"
                      name="submitterName"
                      value={formData.submitterName}
                      onChange={handleInputChange}
                      className="auth-input-field"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label htmlFor="submitterEmail" className="block text-xs font-semibold uppercase tracking-wider text-grayson-navy/70 mb-2">
                      Personal Email *
                    </label>
                    <input
                      type="email"
                      id="submitterEmail"
                      name="submitterEmail"
                      value={formData.submitterEmail}
                      onChange={handleInputChange}
                      className="auth-input-field"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="submitterSchoolEmail" className="block text-xs font-semibold uppercase tracking-wider text-grayson-navy/70 mb-2">
                      School Email *
                    </label>
                    <input
                      type="email"
                      id="submitterSchoolEmail"
                      name="submitterSchoolEmail"
                      value={formData.submitterSchoolEmail}
                      onChange={handleInputChange}
                      className="auth-input-field"
                      placeholder="first.last1234@g.gcpsk12.org"
                      pattern=".*@g\.gcpsk12\.org$"
                      title="Must be a valid @g.gcpsk12.org email address"
                      required
                    />
                    <p className="text-[10px] text-grayson-navy/60 mt-1 tracking-wide">Must end with @g.gcpsk12.org</p>
                  </div>
                </div>
              </div>

              {/* Clubs Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-grayson-navy tracking-wide">Club Information</h4>
                    <span className="text-xs px-2 py-1 rounded bg-grayson-gold-soft text-grayson-navy/80 font-medium">{clubs.length} item{clubs.length !== 1 && 's'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={addClub}
                    className="btn-outline-brand text-sm"
                  >
                    + Add Club
                  </button>
                </div>
                <div className="space-y-8">
                  {clubs.map((club, index) => (
                    <div key={index} className="relative rounded-xl border border-border-subtle/60 bg-white/60 backdrop-blur-sm p-6 shadow-brand-soft hover-raise transition-all">
                      {clubs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeClub(index)}
                          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center text-sm shadow-md hover:brightness-110 focus:outline-none"
                          title="Remove this club"
                        >
                          ×
                        </button>
                      )}
                      <h5 className="text-sm font-semibold tracking-wide text-grayson-navy/70 mb-4">Club #{index + 1}</h5>
                      <div className="space-y-5">
                        <div>
                          <label htmlFor={`clubName-${index}`} className="block text-xs font-semibold uppercase tracking-wider text-grayson-navy/70 mb-2">
                            Club Name *
                          </label>
                          <input
                            type="text"
                            id={`clubName-${index}`}
                            value={club.clubName}
                            onChange={(e) => handleClubChange(index, 'clubName', e.target.value)}
                            className="auth-input-field"
                            placeholder="Enter the club name"
                          />
                        </div>
                        <div>
                          <label htmlFor={`description-${index}`} className="block text-xs font-semibold uppercase tracking-wider text-grayson-navy/70 mb-2">
                            Description *
                          </label>
                          <textarea
                            id={`description-${index}`}
                            value={club.description}
                            onChange={(e) => handleClubChange(index, 'description', e.target.value)}
                            rows={3}
                            className="auth-input-field resize-y min-h-[120px]"
                            placeholder="Brief description and why students should join"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-brand w-full py-4 text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
                      Submitting...
                    </div>
                  ) : (
                    `Submit ${clubs.filter(c => c.clubName.trim() && c.description.trim()).length} Club${clubs.filter(c => c.clubName.trim() && c.description.trim()).length !== 1 ? 's' : ''}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Submitted Clubs List */}
      <section className="relative py-24 px-6 lg:px-10">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-grayson-navy-soft/10 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center gradient-text-brand mb-14">
            All Submitted Clubs ({clubsCount})
          </h3>
          {allClubs.length === 0 ? (
            <div className="card-glass p-12 text-center">
              <p className="text-grayson-navy/70 text-lg">No clubs have been submitted yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allClubs.map((club) => (
                <div
                  key={club._id}
                  className="group relative card-glass p-6 hover-raise transition-all duration-300"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-grayson-gold/15 via-transparent to-transparent pointer-events-none" />
                  <h4 className="text-lg font-bold text-grayson-navy mb-3 tracking-tight">
                    {club.clubName}
                  </h4>
                  <p className="text-sm text-grayson-navy/70 leading-relaxed mb-5 line-clamp-5">
                    {club.description}
                  </p>
                  <div className="divider-soft my-4" />
                  <div className="flex items-center justify-between text-[11px] text-grayson-navy/60">
                    <p>
                      By <span className="font-medium text-grayson-navy/80">{club.submitterName}</span>
                    </p>
                    <p className="tabular-nums">
                      {new Date(club._creationTime).toLocaleDateString()} {new Date(club._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto relative bg-gradient-to-br from-grayson-navy via-grayson-green to-grayson-navy text-white/90 py-10">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40 mix-blend-overlay" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs md:text-sm tracking-wide">
            <span>© {new Date().getFullYear()} Grayson High School</span>
            <span className="hidden sm:inline">•</span>
            <span>Powered by NHS</span>
            <span className="hidden sm:inline">•</span>
            <span>Site created by Brayden Price</span>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
}
