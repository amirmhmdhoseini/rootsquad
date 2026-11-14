// Editable site settings: contact details, internal API paths and project / member links.
// Replace every value that starts with "your" or contains "example" with the real one.
export const siteConfig = {
  contact: {
    phoneDisplay: '0993 694 6400',
    phoneHref: 'tel:+989936946400',
    email: 'rootsquad.support@gmail.com',
    emailHref: 'mailto:rootsquad.support@gmail.com',
    telegram: '@rootsquad_support',
    telegramHref: 'https://t.me/rootsquad_support',
    instagram: '@root_ir',
    instagramHref: 'https://instagram.com/root_ir',
  },

  // Same-origin Django API; proxied to port 8000 by Vite during development.
  formEndpoint: '/api/contact/',
  csrfEndpoint: '/api/csrf/',

  // Same order as the project list: Sanaa, Delyar, Jenna Brides, Hafezi, Monplus, Manamehr (inactive, no link).
  // review: the client's words shown in the project popup. Leave text '' to hide the block.
  //   text / name / role can be a plain string, or { fa: '...', ar: '...', en: '...' } to translate.
  projects: [
    { url: 'sanaaonlineshop.com', review: { text: '', name: '', role: '' } },
    { url: 'delyarngo.com', review: { text: '', name: '', role: '' } },
    { url: 'jennahbrides.com', review: { text: 'I have worked with the RootSquade team on several projects for my Hair & Beauty business, including designing and developing my website and creating a service and pricing link for my Instagram page (@jennah_hair_salon).I am extremely happy with their work. The team is professional, knowledgeable and understands their clients’ goals. They are also very responsive, open to feedback and respectful of any requested changes or edits.I highly recommend RootSquade, not only to businesses in Iran but also to Iranians living overseas. A pleasure to work with!', name: '', role: '' } },
    { url: 'hafeziarchitects.com', review: { text: '', name: '', role: '' } },
    { url: 'monplusco.ir', review: { text: '', name: '', role: '' } },
    { url: '', review: { text: '', name: '', role: '' } },
  ],

  // Optional LinkedIn / GitHub link per member, same order as the team list.
  team: [{ link: '' }, { link: '' }, { link: '' }, { link: '' }],
}
