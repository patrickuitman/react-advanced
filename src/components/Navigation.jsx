import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AddEventModal } from "./AddEventModal";
import { Button } from "@chakra-ui/react";

export const Navigation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
      }}
    >
      <div>
        <Link to="/">
          <Button colorScheme="blue" variant="link" size="lg">
            Events
          </Button>
        </Link>
      </div>
      <div>
        <Button colorScheme="blue" size="lg" onClick={handleModalOpen}>
          Add Event
        </Button>
      </div>
      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalClose}
      />
    </nav>
  );
};
