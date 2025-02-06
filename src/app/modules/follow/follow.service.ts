import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const followUser = async (followerId: string, followedId: string) => {
  if (followerId === followedId) {
    throw new Error("Cannot follow yourself");
  }

  const existingFollower = await prisma.user.findUnique({
    where: {
      id: followerId,
    },
  });

  if (!existingFollower) {
    throw new Error("Follower user not found");
  }

  const existingFollowed = await prisma.user.findUnique({
    where: {
      id: followedId,
    },
  });

  if (!existingFollowed) {
    throw new Error("Followed user not found");
  }

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  if (existingFollow) {
    throw new Error("Already following this user");
  }

  const result = await prisma.follow.create({
    data: {
      followerId,
      followedId,
    },
  });

  return result;
};

const unfollowUser = async (followerId: string, followedId: string) => {
  const existingFollower = await prisma.user.findUnique({
    where: {
      id: followerId,
    },
  });

  if (!existingFollower) {
    throw new Error("Follower user not found");
  }

  const existingFollowed = await prisma.user.findUnique({
    where: {
      id: followedId,
    },
  });

  if (!existingFollowed) {
    throw new Error("Followed user not found");
  }

  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  if (!existingFollow) {
    throw new Error("Not following this user");
  }

  const result = await prisma.follow.delete({
    where: {
      id: existingFollow.id,
    },
  });

  return result;
};

const getFollowing = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      following: {
        include: {
          followed: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

const getFollowers = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      follower: {
        include: {
          follower: {
            select: {
              id: true,
              fullName: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

export const FollowServices = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
};
