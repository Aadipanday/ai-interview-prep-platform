import InterviewForm from "../ui/InterviewForm";
import "../style/home.scss";
import LogoutButton from "../../auth/components/LogoutButton";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="home">
      <header className="home__header">
        <div>
          <p className="home__eyebrow">Interview workspace</p>
          <h1>Welcome{user?.username ? `, ${user.username}` : ""}</h1>
        </div>
        <LogoutButton />
      </header>
      <InterviewForm />
    </main>
  );
};

export default Home;
