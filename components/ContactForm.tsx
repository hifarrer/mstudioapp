"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-700 rounded-lg p-8">
      {sent ? (
        <p className="text-accent-olive-300 text-center py-4">
          Thanks! We’ll get back to you soon.
        </p>
      ) : (
        <form
          action="#"
          method="post"
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="contact-name"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              className="w-full bg-neutral-black border border-neutral-700 rounded-md px-3 py-2 text-neutral-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-accent-clay-500 focus:border-accent-clay-500 resize-none"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-clay-500 hover:bg-accent-clay-300 text-neutral-white font-medium py-3 rounded-md transition-colors"
          >
            Send message
          </button>
        </form>
      )}
    </div>
  );
}
