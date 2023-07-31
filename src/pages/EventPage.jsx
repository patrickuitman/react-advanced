import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Heading,
  Box,
  Image,
  Text,
  Badge,
} from "@chakra-ui/react";
import { EventForm } from "../components/EventForm";

export const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [createdByUser, setCreatedByUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (isConfirmed) {
      fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          setDeleteMessage("Event successfully deleted.");
          navigate("/");
        })
        .catch((error) => {
          setDeleteMessage("Failed to delete event.");
          console.error("Error deleting event:", error);
        });
    } else {
      setDeleteMessage("Event deletion canceled.");
    }
  };

  const handleFormSubmit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching event:", error);
      });
  }, [eventId]);

  useEffect(() => {
    if (event) {
      fetch(`http://localhost:3000/users/${event.createdBy}`)
        .then((response) => response.json())
        .then((data) => {
          setCreatedByUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          setCreatedByUser(null);
        });
    }
  }, [event]);

  const categories = [
    { id: 1, name: "sports" },
    { id: 2, name: "games" },
    { id: 3, name: "relaxation" },
  ];

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  if (loading) {
    return <Heading>Loading...</Heading>;
  }

  if (!event) {
    return <Heading>Event not found</Heading>;
  }

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh">
      <Box width="100%">
        <Flex justifyContent="flex-start" mb="4">
          <Button colorScheme="blue" onClick={handleBackClick}>
            Back
          </Button>
        </Flex>
        {isEditing ? (
          <EventForm event={event} onSubmit={handleFormSubmit} />
        ) : (
          <Flex direction="column" align="center">
            <Image
              src={event.image}
              alt={event.title}
              mb="4"
              height="300px"
              objectFit="cover"
            />
            <Heading>{event.title}</Heading>
            {createdByUser ? (
              <React.Fragment>
                <Image
                  src={createdByUser.image}
                  alt={createdByUser.title}
                  mb="4"
                  height="300px"
                  objectFit="cover"
                />
                <Text>Created by: {createdByUser?.name}</Text>
              </React.Fragment>
            ) : (
              <Text>Created by: Unknown User</Text>
            )}
            <Flex mt="4">
              <Button mr="2" colorScheme="blue" onClick={handleEditClick}>
                Edit
              </Button>
              <Button colorScheme="red" onClick={handleDeleteClick}>
                Delete
              </Button>
            </Flex>
            <Box mt="4">
              <p>{event.description}</p>
              <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(event.endTime).toLocaleString()}</p>
              <p>Location: {event.location}</p>
              <Flex mt="2" flexWrap="wrap">
                {event.categoryIds?.map((categoryId) => (
                  <Badge key={categoryId} colorScheme="blue" mr="2" mb="2">
                    {getCategoryName(categoryId)}
                  </Badge>
                ))}
              </Flex>
            </Box>
            {deleteMessage && <Text mt="4">{deleteMessage}</Text>}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
