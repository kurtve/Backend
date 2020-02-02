// initial users

exports.seed = async knex => {
  await knex('users').insert([
    {
      id: 1,
      username: 'kurt',
      role: 'admin',
      password: '$2a$14$cyo1TEVt1lqIa.1he0H0RuiXcTF/zmO2UHEtXkhuXue1knoiRj8Ce',
    },
    {
      id: 2,
      username: 'johndoe',
      role: 'employee',
      password: '$2a$14$K81fXiP0U2AMxoL1rrGQ9uOrSBoFG6CrFO0pSqpwM2DmLv63t6mA.',
    },
    {
      id: 3,
      username: 'janedoe',
      role: 'employer',
      password: '$2a$14$Ea0/gf.XRJpDA0FmjMlhsuy6IKVc989s9YHpnmQZShE/13YDCHdei',
    },
    {
      id: 4,
      username: 'adamsmith',
      role: 'employee',
      password: '$2a$14$BN3neb7J7cA1k1GA8HsGReK5jnexjKFYYt5JkQWVw6rhgPoDJ7kQ2',
    },
    {
      id: 5,
      username: 'annjones',
      role: 'employer',
      password: '$2a$14$3MlMQAVFxRqMRT7pKwIppuHB.MDyue2skY/gS23U454vSFGzAbRhu',
    },
  ]);
};
