import {withAuthRedirect} from "./hoc/auth-redirect";

const CommonPage = () => {
    return (
        <h1>Common Page</h1>
    )
}
export default withAuthRedirect(CommonPage)
