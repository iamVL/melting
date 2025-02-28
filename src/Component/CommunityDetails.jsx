import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const GroupDetails = () => {
  const { id } = useParams(); // ✅ Get group ID from URL
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_PATH}/groups/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching group:", error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (!group) return <p>Group not found.</p>;

  return (
    <div className="group-details">
      <h2>{group.name}</h2>
      <p>{group.description}</p>
      {/* ✅ Add back button */}
      <button onClick={() => window.history.back()} className="back-button">
        ← Back to Communities
      </button>
    </div>
  );
};

export default GroupDetails;
