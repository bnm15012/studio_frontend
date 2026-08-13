import type { RegisterFormValues } from "@/Pages/Auth/auth.api";
export const transformRegisterData = (data: RegisterFormValues) => ({
    studioName: data.studioName as string,
    location: data.location as string,
    userName: data.userName as string,
    email: data.email as string,
    contactDetails: data.contactDetails as string,
    branchList: [
        {
            address: data.address as string,
            city: data.location as string,
            state: data.state as string,
            pincode: data.pincode as string,
            phone: data.contactDetails as string,
        },
    ],
});
