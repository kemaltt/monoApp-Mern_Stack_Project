const { UserDAO } = require("../../db-access");
const { makeUser } = require("../../domain/User");
const { createActivityLog } = require("../../services/activity-log.service");
// const {
//   enrichPostsWithUserInfos,
// } = require("./background-services/enrich-posts-with-userinfos");

async function showMyProfile({ userId, req }) {
  const foundUser = await UserDAO.findById(userId);
  if (!foundUser) {
    throw new Error("User not found");
  }

  const user = makeUser(foundUser);

  // Activity log oluştur (profile görüntüleme)
  await createActivityLog({
    user: userId,
    userName: user.name,
    action: 'read',
    resourceType: 'profile',
    resourceId: userId,
    details: { action: 'view_profile' },
    ipAddress: req?.ip,
    userAgent: req?.get('user-agent')
  });

  // const posts = await PostsDAO.findPostsByUserId(userId);
  // const postsEnriched = await enrichPostsWithUserInfos({ posts });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profile_image: user.profile_image,
    totalBalance: user.totalBalance,
  };
}

module.exports = {
  showMyProfile,
};
