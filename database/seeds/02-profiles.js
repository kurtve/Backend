// initial profiles

exports.seed = async knex => {
  await knex('profiles').insert([
    {
      id: 1,
      user_id: 2,
      name: 'John Doe',
      phone: '(212) 555-1212',
      email: 'jdoe@gmail.com',
      description:
        'I am a front-end developer looking for start-up opportunities',
      skills: 'HTML, CSS, Javascript, React, Redux, git, jest',
      education1: 'Lambda School',
      education2: 'University of Maryland',
      education3: '',
      job_history1: 'Waiter, TGI Friday',
      job_history2: '',
      job_history3: '',
    },
    {
      id: 2,
      user_id: 4,
      name: 'Adam Smith',
      phone: '(202) 555-3434',
      email: 'adam@smith.info',
      description: 'I am a back-end developer looking for a remote position',
      skills: 'Javascript, Node, Knex, SQL, git, jest, PostgreSQL, MySQL',
      education1: 'Lambda School',
      education2: 'Portland Community College',
      education3: 'Clearwater High School',
      job_history1: 'Teller, Citibank',
      job_history2: 'Delivery Driver, UPS',
      job_history3: 'Staff, Burger King',
    },
  ]);
};
