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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-navy-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-grayson-green via-grayson-navy to-grayson-green shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Grayson High School
            </h1>
            <p className="text-xl md:text-2xl text-grayson-gold font-semibold">
              Inside Scoop Club Bingo Challenge
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-grayson-gold to-yellow-400 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-grayson-navy mb-6">
              Help Build Our Club Bingo Card!
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Know of awesome clubs at Grayson High School? Submit them below to be featured on our interactive bingo card! 
              Students can explore different clubs, join new communities, and complete their bingo card for amazing prizes.
            </p>

            <div className="bg-gradient-to-r from-grayson-gold/10 to-yellow-100/50 rounded-xl p-6 mb-8 border border-grayson-gold/20">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-grayson-gold rounded-full p-2">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-grayson-navy mb-2">
                🏆 Sponsored by NHS!
              </h3>
              <p className="text-gray-700">
                Participants will complete the bingo card and visit the National Honor Society prize station for exclusive rewards and recognition!
              </p>
            </div>

            {/* Club Count Display */}
            <div className="bg-gradient-to-r from-grayson-green/10 to-grayson-navy/10 rounded-xl p-4 border border-grayson-green/20">
              <p className="text-lg font-semibold text-grayson-navy">
                📊 Total Clubs Submitted: <span className="text-grayson-gold">{clubsCount}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-grayson-navy mb-6 text-center">
              Submit Club(s)
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="text-lg font-semibold text-grayson-navy mb-4">Your Information</h4>
                
                <div>
                  <label htmlFor="submitterName" className="block text-sm font-semibold text-grayson-navy mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="submitterName"
                    name="submitterName"
                    value={formData.submitterName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-grayson-green focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="submitterEmail" className="block text-sm font-semibold text-grayson-navy mb-2">
                    Personal Email *
                  </label>
                  <input
                    type="email"
                    id="submitterEmail"
                    name="submitterEmail"
                    value={formData.submitterEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-grayson-green focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="submitterSchoolEmail" className="block text-sm font-semibold text-grayson-navy mb-2">
                    School Email *
                  </label>
                  <input
                    type="email"
                    id="submitterSchoolEmail"
                    name="submitterSchoolEmail"
                    value={formData.submitterSchoolEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-grayson-green focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="first.last1234@g.gcpsk12.org"
                    pattern=".*@g\.gcpsk12\.org$"
                    title="Must be a valid @g.gcpsk12.org email address"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must end with @g.gcpsk12.org</p>
                </div>
              </div>

              {/* Clubs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-grayson-navy">Club Information</h4>
                  <button
                    type="button"
                    onClick={addClub}
                    className="bg-grayson-green text-white px-4 py-2 rounded-lg hover:bg-grayson-navy transition-colors text-sm font-medium"
                  >
                    + Add Another Club
                  </button>
                </div>

                {clubs.map((club, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 space-y-4 relative">
                    {clubs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeClub(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                        title="Remove this club"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    
                    <h5 className="text-md font-medium text-grayson-navy">Club #{index + 1}</h5>
                    
                    <div>
                      <label htmlFor={`clubName-${index}`} className="block text-sm font-semibold text-grayson-navy mb-2">
                        Club Name *
                      </label>
                      <input
                        type="text"
                        id={`clubName-${index}`}
                        value={club.clubName}
                        onChange={(e) => handleClubChange(index, 'clubName', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-grayson-green focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        placeholder="Enter the club name"
                      />
                    </div>

                    <div>
                      <label htmlFor={`description-${index}`} className="block text-sm font-semibold text-grayson-navy mb-2">
                        Description *
                      </label>
                      <textarea
                        id={`description-${index}`}
                        value={club.description}
                        onChange={(e) => handleClubChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-grayson-green focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none"
                        placeholder="Briefly describe what this club does and why students should join"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-grayson-green to-grayson-navy text-white font-semibold py-4 px-6 rounded-lg hover:from-grayson-navy hover:to-grayson-green transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  `Submit ${clubs.filter(c => c.clubName.trim() && c.description.trim()).length} Club${clubs.filter(c => c.clubName.trim() && c.description.trim()).length !== 1 ? 's' : ''}`
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Submitted Clubs List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-grayson-navy text-center mb-12">
            All Submitted Clubs ({clubsCount})
          </h3>
          
          {allClubs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No clubs have been submitted yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allClubs.map((club) => (
                <div
                  key={club._id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <h4 className="text-lg font-bold text-grayson-navy mb-2">
                    {club.clubName}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {club.description}
                  </p>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-gray-500">
                      Submitted by: <span className="font-medium">{club.submitterName}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(club._creationTime).toLocaleDateString()} at {new Date(club._creationTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-grayson-navy via-grayson-green to-grayson-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm opacity-75">
            <span>© 2024 Grayson High School</span>
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
