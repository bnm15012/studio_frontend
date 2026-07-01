export const transformRegisterData = (data: any) => ({
    studioName: data.studioName,
    location: data.location,
    userName: data.userName,
    email: data.email,
    contactDetails: data.contactDetails,
    branchList: [
        {
            address: data.address,
            city: data.location,
            state: data.state,
            pincode: data.pincode,
            phone: data.contactDetails,
        },
    ],
});
