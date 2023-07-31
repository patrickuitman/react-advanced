import React, { useState, useEffect } from "react";
import {
  Heading,
  Box,
  Image,
  Flex,
  Text,
  Badge,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const apiUrl = "http://localhost:3000/events";

export const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
        localStorage.setItem("events", JSON.stringify(data));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const categories = [
    { id: 1, name: "sports" },
    { id: 2, name: "games" },
    { id: 3, name: "relaxation" },
  ];

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const filteredEvents = events.filter((event) => {
    const titleMatch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const categoryMatch =
      filterCategory === "" ||
      event.categoryIds.includes(parseInt(filterCategory));
    return titleMatch && categoryMatch;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="20vh">
      <Box width="100%" mt="0">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchChange}
          mt="4"
        />
        <Select
          placeholder="Filter by category"
          value={filterCategory}
          onChange={handleFilterChange}
          mt="4"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Flex flexWrap="wrap" mt="4" justify="center">
          {filteredEvents.map((event) => (
            <Box key={event.id} width="300px" p="4">
              <Box
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                height="200px"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  objectFit="cover"
                  height="100%"
                  width="100%"
                />
              </Box>
              <Heading size="md" mt="2">
                {event.title}
              </Heading>
              <Text>{event.description}</Text>
              <Text>
                Start Time: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text>End Time: {new Date(event.endTime).toLocaleString()}</Text>
              <Flex mt="2">
                <Text>Location: {event.location}</Text>
              </Flex>
              <Flex mt="2" flexWrap="wrap">
                {event.categoryIds &&
                  event.categoryIds.map((categoryId) => (
                    <Badge key={categoryId} colorScheme="blue" mr="2" mb="2">
                      {getCategoryName(categoryId)}
                    </Badge>
                  ))}
              </Flex>
              <Flex mt="2" justify="space-between">
                <Link to={`/event/${event.id}`}>
                  <Button colorScheme="blue">View Details</Button>
                </Link>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};
