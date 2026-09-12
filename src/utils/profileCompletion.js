const getProfileCompletion = (user, profile) => {

  const fields = [

    user.fullName,

    user.email,

    user.phone,

    profile.gender,

    profile.dateOfBirth,

    profile.bloodGroup,

    profile.location,

    profile.height,

    profile.weight

  ];

  const completed = fields.filter(Boolean).length;

  const percentage = Math.round(
    (completed / fields.length) * 100
  );

  return percentage;
};

module.exports = getProfileCompletion;