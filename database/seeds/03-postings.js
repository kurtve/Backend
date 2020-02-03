// initial postings

exports.seed = async knex => {
  await knex('postings').insert([
    {
      id: 1,
      user_id: 3,
      job_title: 'Front-End Web Dev',
      company: 'ACME Widgets',
      phone: '(614) 555-9191',
      email: 'hr@acme.com',
      company_url: 'www.acme.com',
      job_desc: 'Front-end web developer needed to maintain crappy legacy code',
      skills: 'HTML, CSS, Javascript, Sharepoint, Microsoft IE',
      level: 'Entry-level',
      pay: '$30,000 - $40,000 depending on experience',
    },
    {
      id: 2,
      user_id: 5,
      job_title: 'Full-stack Developer',
      company: 'Unicornz',
      phone: '(508) 555-8877',
      email: 'ceo@unicornz.com',
      company_url: 'www.unicornz.com',
      job_desc:
        'Looking for a hot-shot developer to create a state-of-the-art web site',
      skills: 'HTML, CSS, Javascript, React, Redux, Node, Express, PostgreSQL',
      level: '3-5 years experience doing web development',
      pay: '$120K -$150K plus stock options',
    },
  ]);
};
