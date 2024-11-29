import { User } from "@prisma/client";
import { getSessionUser } from "@/server/userData";
import prisma from "@/app/utils/connect";
import { UpdateProfile } from "./profileServer";

export const ProfileEdit = (
  profile: Pick<User, "email" | "familyGroup" | "firstName" | "lastName">
) => {
  return (
    <div className="relative rounded-xl  w-full md:w-[500px] h-full md:h-[550px]">
      <img
        className="w-full h-full absolute rounded-xl"
        src="/backgrounds/edited_profile_template.png"
        alt=""
      />
      <div className="absolute w-full h-full ">
        <div className="h-[20%] w-full"></div>
        <div className="w-full h-[80%] flex">
          <div className="w-[20%] h-full"></div>
          <div className="w-[60%] h-full pt-10">
            <ProfileForm {...profile}></ProfileForm>
          </div>
          <div className="w-[20%] h-full"></div>
        </div>
      </div>
    </div>
  );
};

export const ProfileForm = (
  profile: Pick<User, "email" | "familyGroup" | "firstName" | "lastName">
) => {
  return (
    <form action={UpdateProfile} className="text-[#1e312d] w-full">
      <h1 className="play  font-bold text-3xl">Email</h1>
      <input type="email" name="" id="" disabled value={profile.email} />
      <h1 className="play font-bold text-3xl">First Name</h1>
      <input
        type="text"
        name="firstName"
        id=""
        defaultValue={profile.firstName}
      />
      <h1 className="play font-bold text-3xl">Last Name</h1>
      <input
        type="text"
        name="lastName"
        id=""
        defaultValue={profile.lastName}
      />
      <h1 className="play font-bold text-3xl">You are part of</h1>
      <input type="fam" name="" id="" disabled value={profile.familyGroup} />
      <div className="w-full flex justify-center">
        <button type="submit">Save Changes</button>
      </div>
    </form>
  );
};
