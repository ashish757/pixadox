import {Link} from "react-router-dom";

const LandingPage = () => {

    return (
        <div className="landing-page">
            <h1>Welcome to the Landing Page</h1>
            <p>This is the main entry point of the application.</p>

            <Link to={"/upload"}><button>Encode</button> </Link>
        </div>
    )
}

export default LandingPage;