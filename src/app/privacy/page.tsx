export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-5 text-neutral-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold text-white">Privacy Policy — Vibexa</h1>
      <p className="text-xs text-neutral-400">Last updated: November 2026</p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
        <p>
          Vibexa collects only the email address you provide when creating an account, along
          with your saved playlists, liked songs, and any audio files or cover images you
          voluntarily upload.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">2. How We Use Information</h2>
        <p>
          Your information is used solely to authenticate your account, personalize your music
          library, and store your playlists securely via Supabase. We do not sell or share your
          personal data with third-party advertisers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">3. Third-Party Services</h2>
        <p>
          Vibexa uses Supabase for authentication and storage, and third-party public APIs to
          display and stream media content.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">4. Contact</h2>
        <p>
          For any privacy questions or account deletion requests, please contact the support
          email listed on our store page.
        </p>
      </section>
    </div>
  );
}