import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

export const EventForm = ({ event, onSubmit }) => {
  const history = useNavigate();
  const isNewEvent = !event;
  const initialFormData = event || {
    title: "",
    description: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    createdBy: 1,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestOptions = {
        method: isNewEvent ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      };

      const url = isNewEvent
        ? "http://localhost:3000/events"
        : `http://localhost:3000/events/${event.id}`;
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (isNewEvent) {
        setFormData({ ...formData, id: data.id });
        onSubmit();
        history.push("/");
      } else {
        onSubmit();
        history.push(`/event/${data.id}`);
      }
    } catch (error) {
      console.error("Error adding/updating event:", error);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <FormControl mb="4">
        <FormLabel>Title</FormLabel>
        <Input name="title" value={formData.title} onChange={handleChange} />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Image URL</FormLabel>
        <Input name="image" value={formData.image} onChange={handleChange} />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Location</FormLabel>
        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Start Time</FormLabel>
        <Input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>End Time</FormLabel>
        <Input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
        />
      </FormControl>
      <Button type="submit" colorScheme="blue">
        {isNewEvent ? "Add Event" : "Save Changes"}
      </Button>
    </Box>
  );
};
