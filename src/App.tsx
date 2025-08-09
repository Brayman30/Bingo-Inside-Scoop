import { useState, useEffect, useMemo } from "react";
import { Input } from "./components/ui/Input";
import { FormField } from "./components/ui/FormField";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster, toast } from "sonner";

interface Club {
  clubName: string;
  // Keep description to satisfy backend API, but no longer user-editable
  description: string;
}

export default function App() {
  const [formData, setFormData] = useState({
    submitterName: "",
    submitterEmail: "",
    submitterSchoolEmail: "", // will hold only prefix before @
  });
  // Clubs array (each line = one input row)
  const [clubs, setClubs] = useState<Club[]>([{ clubName: "", description: "" }]);
  const [errors, setErrors] = useState<{
    submitterName?: string;
    submitterEmail?: string;
    submitterSchoolEmail?: string;
    clubs: string[];
  }>({ clubs: [""] });

  // Derived list of club names (trimmed) from inputs
  const parsedClubNames = useMemo(() => clubs.map(c => c.clubName.trim()).filter(Boolean), [clubs]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMultipleClubs = useMutation(api.clubs.submitMultipleClubs);
  const allClubs = useQuery(api.clubs.getAllClubs) || [];
  const clubsCount = useQuery(api.clubs.getClubsCount) || 0;

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "submitterName":
        return value.trim() ? undefined : "Name is required";
      case "submitterEmail":
        return /.+@.+\..+/.test(value) ? undefined : "Valid email required";
      case "submitterSchoolEmail":
        return value.trim().length >= 3 ? undefined : "Prefix too short";
      default:
        return undefined;
    }
  };

  const validateClubName = (value: string, index: number) => {
    const v = value.trim();
    if (!v) return "Required";
    if (v.length < 2) return "Too short";
    const lower = v.toLowerCase();
    // Duplicate among current entries
    const dup = clubs.some((c, i) => i !== index && c.clubName.trim().toLowerCase() === lower);
    if (dup) return "Duplicate";
    // Already submitted
    if ((allClubs || []).some(c => c.clubName.trim().toLowerCase() === lower)) return "Exists";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation pass
    const newErrors = { ...errors } as typeof errors;
    newErrors.submitterName = validateField("submitterName", formData.submitterName);
    newErrors.submitterEmail = validateField("submitterEmail", formData.submitterEmail);
    newErrors.submitterSchoolEmail = validateField("submitterSchoolEmail", formData.submitterSchoolEmail);
    newErrors.clubs = clubs.map((c, i) => validateClubName(c.clubName, i));
    setErrors(newErrors);

    const hasErrors = !!(newErrors.submitterName || newErrors.submitterEmail || newErrors.submitterSchoolEmail || newErrors.clubs.some(e => e));
    if (hasErrors) {
      toast.error("Please fix validation errors before submitting");
      return;
    }
    const validClubs = clubs.filter((c, i) => !newErrors.clubs[i] && c.clubName.trim()).map(c => ({ clubName: c.clubName.trim(), description: "" }));

    setIsSubmitting(true);
    try {
      const result = await submitMultipleClubs({
        clubs: validClubs,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail,
        submitterSchoolEmail: `${formData.submitterSchoolEmail}@g.gcpsk12.org`,
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
        setErrors({ clubs: [""] });
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
    const { name, value } = e.target;
    if (name in formData) setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Removed per-club row handlers (replaced by textarea parsing)

  // Auto-validate clubs block
  useEffect(() => {
    setErrors(prev => ({ ...prev, clubs: clubs.map((c, i) => validateClubName(c.clubName, i)) }));
  }, [clubs, allClubs]);

  // Auto validate initial empties on mount for accessibility (optional)
  useEffect(() => {
    setErrors(prev => ({ ...prev }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" id="top">
      {/* Header / Hero combined */}
      <header className="relative overflow-hidden pb-10 pt-16 animate-fade-in" role="banner">
        <div className="absolute inset-0 opacity-70 bg-gradient-brand-linear" />
        <div className="absolute inset-0 bg-gradient-radial-gold mix-blend-overlay" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-radial-green" />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
        <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md mb-4 animate-rise">
              Grayson High School
            </h1>
            <p className="text-lg md:text-2xl font-semibold text-grayson-gold drop-shadow-sm mb-8">
              Inside Scoop Club Bingo
            </p>
            <div className="max-w-3xl mx-auto card-glass card-glow-border p-8 md:p-10 animate-rise">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-grayson-gold via-grayson-green to-grayson-navy shadow-brand-soft flex items-center justify-center" aria-hidden="true">
                  <svg className="w-8 h-8 text-white" role="img" aria-label="Menu layers icon" fill="currentColor" viewBox="0 0 20 20">
                    <title>Club layers icon</title>
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-italic md:text-3xl font-bold text-grayson-navy mb-4">
                Help Build Our Inside Scoop Bingo Card!
              </h2>
              <p className="text-base md:text-lg text-grayson-navy/85 leading-relaxed">
                Know awesome clubs at Grayson High School? Submit them below to be featured on the bingo card.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-grayson-navy-soft/40 border border-white/30 px-5 py-4 backdrop-blur-sm flex flex-col items-center text-center">
                  <span className="badge-gold font-bold mb-2">Live Count</span>
                  <p className="text-sm font-bold text-grayson-navy">Total Clubs Submitted</p>
                  <p className="text-3xl font-extrabold gradient-text-gold mt-1 tabular-nums">{clubsCount}</p>
                </div>
                <div className="rounded-xl bg-grayson-green-soft/40 border border-white/30 px-5 py-4 backdrop-blur-sm flex flex-col items-center text-center">
                  <span className="badge-gold font-bold mb-2">NHS</span>
                  <p className="text-sm font-bold text-grayson-navy">Sponsored Rewards</p>
                  <p className="text-sm mt-1 text-grayson-navy/90">Participants will complete their bingo card and claim exclusive prizes, given out at the NHS booth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* Submission Form */}
        <section className="relative py-20 px-6 lg:px-10" aria-labelledby="submit-clubs-heading">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-grayson-gold-soft/20 to-transparent" />
          <div className="relative max-w-3xl mx-auto">
            <div className="card-glass card-glow-border p-8 md:p-10 animate-rise">
              <h2 id="submit-clubs-heading" className="text-2xl md:text-3xl font-bold text-grayson-navy text-center mb-8">
                Submit Club(s)
              </h2>
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <div className="space-y-6" aria-labelledby="your-info-heading">
                  <div className="flex items-center gap-3">
                    <h3 id="your-info-heading" className="text-lg font-semibold text-grayson-navy tracking-wide">Your Information</h3>
                    <div className="flex-1 divider-soft" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Your Name"
                      htmlFor="submitterName"
                      required
                      error={errors.submitterName}
                    >
                      <Input
                        id="submitterName"
                        name="submitterName"
                        value={formData.submitterName}
                        placeholder="Full name"
                        onChange={handleInputChange}
                        onBlur={(e) => setErrors(prev => ({ ...prev, submitterName: validateField("submitterName", e.target.value) }))}
                        aria-invalid={!!errors.submitterName}
                        aria-describedby={errors.submitterName ? 'error-submitterName' : undefined}
                        required
                        error={!!errors.submitterName}
                      />
                    </FormField>
                    <FormField
                      label="Personal Email"
                      htmlFor="submitterEmail"
                      required
                      error={errors.submitterEmail}
                    >
                      <Input
                        type="email"
                        id="submitterEmail"
                        name="submitterEmail"
                        value={formData.submitterEmail}
                        placeholder="you@email.com"
                        onChange={handleInputChange}
                        onBlur={(e) => setErrors(prev => ({ ...prev, submitterEmail: validateField("submitterEmail", e.target.value) }))}
                        aria-invalid={!!errors.submitterEmail}
                        aria-describedby={errors.submitterEmail ? 'error-submitterEmail' : undefined}
                        required
                        error={!!errors.submitterEmail}
                      />
                    </FormField>
                    <FormField
                      label="School Email"
                      htmlFor="submitterSchoolEmail"
                      required
                      help="We'll append @g.gcpsk12.org automatically"
                      error={errors.submitterSchoolEmail}
                      className="md:col-span-2"
                    >
                      <div className={`flex rounded-md border border-border-subtle/60 bg-white/70 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-grayson-gold/60 focus-within:border-grayson-gold/70 overflow-hidden ${errors.submitterSchoolEmail ? 'border-red-400 focus-within:ring-red-400/40 focus-within:border-red-500' : ''}`}>
                        <Input
                          id="submitterSchoolEmail"
                          name="submitterSchoolEmail"
                          value={formData.submitterSchoolEmail}
                          placeholder="first.last1234"
                          onChange={handleInputChange}
                          onBlur={(e) => setErrors(prev => ({ ...prev, submitterSchoolEmail: validateField("submitterSchoolEmail", e.target.value) }))}
                          aria-invalid={!!errors.submitterSchoolEmail}
                          aria-describedby={errors.submitterSchoolEmail ? 'error-submitterSchoolEmail' : 'school-email-domain'}
                          required
                          error={!!errors.submitterSchoolEmail}
                          className="!shadow-none !border-0 !rounded-none flex-1 bg-transparent"
                        />
                        <span id="school-email-domain" className="px-3 py-2 text-sm select-none flex items-center text-grayson-navy/70 border-l border-border-subtle/60 bg-white/50">@g.gcpsk12.org</span>
                      </div>
                    </FormField>
                  </div>
                </div>

                {/* Clubs Section */}
                <div className="space-y-6" aria-labelledby="club-info-heading">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h3 id="club-info-heading" className="text-lg font-semibold text-grayson-navy tracking-wide">Club Names</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setClubs(prev => [...prev, { clubName: "", description: "" }]);
                        setErrors(prev => ({ ...prev, clubs: [...prev.clubs, ""] }));
                      }}
                      className="btn-outline-brand text-sm focus-ring"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clubs.map((club, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="flex-1">
                          <FormField
                            label={`Club ${index + 1}`}
                            htmlFor={`club-${index}`}
                            required
                            error={errors.clubs[index] || undefined}
                          >
                            <Input
                              id={`club-${index}`}
                              value={club.clubName}
                              placeholder="Club name"
                              onChange={(e) => {
                                const value = e.target.value;
                                setClubs(prev => prev.map((c, i) => i === index ? { ...c, clubName: value } : c));
                                setErrors(prev => ({ ...prev, clubs: prev.clubs.map((err, i) => i === index ? validateClubName(value, index) : err) }));
                              }}
                              onBlur={(e) => setErrors(prev => ({ ...prev, clubs: prev.clubs.map((err, i) => i === index ? validateClubName(e.target.value, index) : err) }))}
                              error={!!errors.clubs[index]}
                              aria-invalid={!!errors.clubs[index]}
                              aria-describedby={errors.clubs[index] ? `error-club-${index}` : undefined}
                            />
                          </FormField>
                        </div>
                        {clubs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setClubs(prev => prev.filter((_, i) => i !== index));
                              setErrors(prev => ({ ...prev, clubs: prev.clubs.filter((_, i) => i !== index) }));
                            }}
                            className="mt-6 inline-flex items-center justify-center w-8 h-8 rounded-md bg-danger text-white text-sm shadow-md hover:brightness-110 focus-ring"
                            aria-label={`Remove club ${index + 1}`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-grayson-navy/60 pt-1">
                    <span className="px-2 py-0.5 rounded bg-grayson-gold-soft/60 text-grayson-navy/80 font-medium">{parsedClubNames.length} name{parsedClubNames.length !== 1 && 's'}</span>
                    <span>Duplicates & existing names flagged inline.</span>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !!errors.submitterName || !!errors.submitterEmail || !!errors.submitterSchoolEmail || errors.clubs.some(e => e) || !parsedClubNames.length}
                    className="btn-brand w-full py-4 text-base focus-ring disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-live="polite"
                    aria-label={isSubmitting ? 'Submitting clubs' : `Submit ${parsedClubNames.length} clubs`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
                        Submitting...
                      </div>
                    ) : (
                      `Submit ${parsedClubNames.length} Club${parsedClubNames.length !== 1 ? 's' : ''}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Submitted Clubs List */}
        <section className="relative py-24 px-6 lg:px-10" aria-labelledby="all-clubs-heading">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-grayson-navy-soft/10 to-transparent" />
          <div className="relative max-w-6xl mx-auto">
            <h2 id="all-clubs-heading" className="text-3xl md:text-4xl font-bold text-center text-white mb-14">
              All Submitted Clubs ({clubsCount})
            </h2>
            {allClubs.length === 0 ? (
              <div className="card-glass p-12 text-center">
                <p className="text-grayson-navy/70 text-lg">No clubs have been submitted yet. Be the first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allClubs.map((club) => (
                  <div
                    key={club._id}
                    className="group relative card-glass p-4 hover-raise transition-all duration-300"
                    role="article"
                    aria-labelledby={`club-title-${club._id}`}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-grayson-gold/15 via-transparent to-transparent pointer-events-none" />
                    <h3 id={`club-title-${club._id}`} className="text-base font-semibold text-grayson-navy mb-2 tracking-tight">
                      {club.clubName}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-grayson-navy/60 pt-1 mt-2 border-t border-white/40">
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
      </main>

      {/* Footer */}
      <footer className="mt-auto relative bg-grayson-navy text-white/90 py-10" role="contentinfo">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40 mix-blend-overlay" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs md:text-sm tracking-wide font-bold">
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
