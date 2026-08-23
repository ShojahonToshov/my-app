import fs from 'fs';

const file = 'c:/Users/user/Desktop/Elara/my-app/src/components/Landing.tsx';
let content = fs.readFileSync(file, 'utf8');

function replaceWithRegex(searchRegex, replaceText) {
  if (searchRegex.test(content)) {
    content = content.replace(searchRegex, replaceText);
  } else {
    console.error('Could not find regex:', searchRegex);
  }
}

// 1. Hero text
replaceWithRegex(
  /Discover and book the city's finest salons, clinics, and premium\s+services\. Effortless scheduling for those who value their time\./,
  "Discover and book the city's finest premium services, or elevate your own business with our intelligent scheduling ecosystem."
);

// 2. Feature Title
replaceWithRegex(
  /A new standard for premium bookings\./,
  "A new standard for premium appointments."
);

// 3. Feature Subtitle
replaceWithRegex(
  /Everything you need to manage your appointments, wrapped in a\s+calm, intelligent interface\./,
  "Everything you need to book services or manage your business, wrapped in a\n                calm, intelligent interface."
);

// 4. Feature 1 text
replaceWithRegex(
  /Skip the back-and-forth messaging\. See exactly when your\s+favorite professionals are free and secure your spot\s+instantly\./,
  "Skip the back-and-forth messaging. Clients see exactly when professionals are free, and businesses get perfectly synced calendars instantly."
);

// 5. Feature 2 text
replaceWithRegex(
  /Read authentic feedback from real customers\. We only allow\s+reviews from completed appointments\./,
  "Read authentic feedback from real customers. We only allow reviews from completed appointments, building genuine trust for businesses."
);

// 6. Feature 3 text
replaceWithRegex(
  /Our dynamic Karma system protects businesses from no-shows,\s+ensuring a reliable ecosystem for everyone\./,
  "Our dynamic Karma system protects businesses from no-shows while rewarding reliable customers, ensuring a seamless ecosystem for everyone."
);

// 7. Feature 4 Title
replaceWithRegex(
  /Effortless rescheduling/,
  "Effortless control"
);

// 8. Feature 4 text
replaceWithRegex(
  /Plans change\. Reschedule your appointments with a single tap,\s+directly from your dashboard—without the awkward phone calls\./,
  "Whether you're rescheduling an appointment as a client or managing your team's shifts as a business owner, do it all with a single tap from a unified, powerful dashboard."
);

// 9. Feature 4 buttons
replaceWithRegex(
  /<div className="px-6 py-3 rounded-full bg-white\/10 text-white text-sm font-medium backdrop-blur-md select-none">\s+Modify time\s+<\/div>\s+<div className="px-6 py-3 rounded-full bg-white\/5 text-white\/50 text-sm font-medium select-none">\s+Cancel\s+<\/div>/,
  `<div className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-md select-none">
                    Modify booking
                  </div>
                  <div className="px-6 py-3 rounded-full bg-white/5 text-white/50 text-sm font-medium select-none">
                    Manage schedule
                  </div>`
);

// 10. How It Works 1
replaceWithRegex(
  /<h4 className="text-xl font-semibold text-\[#121415\] mb-2 tracking-tight">\s+Discover\s+<\/h4>\s+<p className="text-\[#4A4E51\] font-medium leading-relaxed">\s+Search for premium services by category, precise\s+location, or find your favorite professional\.\s+<\/p>/,
  `<h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Discover & Connect
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Clients find premium professionals effortlessly. Businesses reach a curated audience that values quality and reliability.
                      </p>`
);

// 11. How It Works 2
replaceWithRegex(
  /<h4 className="text-xl font-semibold text-\[#121415\] mb-2 tracking-tight">\s+Select & Book\s+<\/h4>\s+<p className="text-\[#4A4E51\] font-medium leading-relaxed">\s+Choose a time that fits your schedule from real-time\s+available slots\. Confirm in one tap\.\s+<\/p>/,
  `<h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Seamless Scheduling
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Real-time availability eliminates back-and-forth messaging. Clients book instantly, while businesses get perfectly organized calendars.
                      </p>`
);

// 12. How It Works 3
replaceWithRegex(
  /<h4 className="text-xl font-semibold text-\[#121415\] mb-2 tracking-tight">\s+Experience\s+<\/h4>\s+<p className="text-\[#4A4E51\] font-medium leading-relaxed">\s+Arrive and enjoy\. Your appointment is confirmed\s+instantly and synced to your schedule\.\s+<\/p>/,
  `<h4 className="text-xl font-semibold text-[#121415] mb-2 tracking-tight">
                        Elevated Experience
                      </h4>
                      <p className="text-[#4A4E51] font-medium leading-relaxed">
                        Clients arrive and enjoy a frictionless service. Professionals focus purely on their craft, letting Elara handle the operations.
                      </p>`
);

// 13. Testimonial 2
replaceWithRegex(
  /\{\s+text: "The most beautifully designed booking platform I've ever used\. Zero friction from search to confirmation\.",\s+author: "Michael T\.",\s+role: "Verified Customer",\s+\}/,
  `{
                  text: "As a salon owner, Elara's dashboard is a breath of fresh air. It handles scheduling beautifully so I can focus on my clients.",
                  author: "Marcus V.",
                  role: "Business Partner",
                }`
);

// 14. FAQ 1
replaceWithRegex(
  /\{\s+q: "Is Elara free to use\?",\s+a: "Yes, booking through Elara is completely free for customers\. You only pay for the services you book directly at the venue\.",\s+\}/,
  `{
                  q: "Is Elara free to use?",
                  a: "Yes, booking through Elara is completely free for customers. Businesses can choose from our flexible partner plans based on their operational needs.",
                }`
);

// 15. FAQ 2
replaceWithRegex(
  /\{\s+q: "Can I cancel or reschedule my appointment\?",\s+a: "Absolutely\. You can manage all your bookings directly from your account dashboard, subject to the venue's policy\.",\s+\}/,
  `{
                  q: "How does Elara prevent no-shows?",
                  a: "We use a smart Karma system that tracks reliability. Customers with high Karma enjoy seamless bookings, while businesses are protected from frequent no-shows.",
                }`
);

// 16. FAQ 3
replaceWithRegex(
  /\{\s+q: "Are the reviews authentic\?",\s+a: "We only allow reviews from customers who have actually completed an appointment at the venue\.",\s+\}/,
  `{
                  q: "Are the reviews authentic?",
                  a: "Absolutely. We only allow reviews from customers who have verified and completed their appointments through the platform.",
                }`
);

// 17. FAQ 4
replaceWithRegex(
  /\{\s+q: "How do I list my business on Elara\?",\s+a: "If you own a premium salon or clinic, you can register for our Business Portal to manage operations on the Elara network\.",\s+\}/,
  `{
                  q: "How do I list my business on Elara?",
                  a: "If you own a premium salon or clinic, simply sign up as a Business to access our partner portal, set up your services, and start accepting bookings.",
                }`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Success!');
