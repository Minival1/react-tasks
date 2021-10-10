import {withAuthRedirect} from "./hoc/auth-redirect";

const AdminPage = () => {
    return (
        <h1>Admin Page</h1>
    )
}
export default withAuthRedirect(AdminPage)
