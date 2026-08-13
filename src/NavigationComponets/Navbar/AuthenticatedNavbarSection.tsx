import UserProfileDropdown from "@/NavigationComponets/Navbar/UserProfileDropDown";
import BranchesDropdown from "@/NavigationComponets/Navbar/BranchesDropdown";
import Notification from "@/NavigationComponets/Navbar/Notification";
import { FlexBetween } from "@/core/components/layout/FlexBox";
import { useAppUI } from "@/context/UIContext";
// import { ThemeToggleButton } from "@/core/utils/theme/ThemeProvider";

const AuthenticatedNavbarSection: React.FC = () => {
    const { user, permissions, currentBranch, token } = useAppUI();

    return (
        <FlexBetween>
            {/* <ThemeToggleButton /> */}
            <Notification branch={currentBranch} token={token} />
            {permissions.BRANCH && <BranchesDropdown />}
            <UserProfileDropdown user={user} />
        </FlexBetween>
    );
};

export default AuthenticatedNavbarSection;
