
import React, { useEffect, useState } from 'react'
import { useColorMode, useColorModeValue, WrapItem, Avatar, AvatarBadge, Flex, Stack, Text, Image, Box } from '@chakra-ui/react';
import { BsCheck2All } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import { conversationsAtom, selectedConversationAtom } from '../atom/messageAtom.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import useShowToast from '../CostomHooks/useShowToast.js';
import { contactAtom } from '../atom/contactAtom.js';
import { useSocket } from '../context/SocketContext.jsx';
import userAtom from '../atom/userAtom.js';

const ContactList = ({ isOnline, contact }) => {
  const { colorMode } = useColorMode();
  const [conversations, setConversation] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const [lastMessage, setLastMessage] = useState('');
  const contacts = useRecoilValue(contactAtom)
  const showToast = useShowToast();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const currentUser = useRecoilValue(userAtom);
  const [newMsg, setNewMsg] = useState(false);
  const [sender,setSender] = useState(true)

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (message.sender === contact._id) {
          setNewMsg(true);
          console.log('inside set new msg')
        }
      })
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  })

  useEffect(() => {
    const setConvToRecoil = async () => {
      try {
        const res = await fetch('/api/message/conversations')
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversation(data);
       
        let result = data.find(conv => conv.participants[0]._id === contact._id);
        if (result) {
          setLastMessage(result.lastMessage.text)
          if(result.lastMessage.sender !== currentUser._id){
            setNewMsg(!result.lastMessage.seen)
            setSender(false)
          }
        }
        else{
          setLastMessage('')
          setSender(false)
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    setConvToRecoil();
  }, [showToast, setConversation]);

  const handleClick = async (e) => {
    e.preventDefault();
    // Execute your function here
    if (conversations.find(conversation => conversation.participants[0]._id === contact._id)) {
      setSelectedConversation({
        _id: conversations.find(conversation => conversation.participants[0]._id === contact._id)._id,
        userId: contact._id,
        name: conversations.find(conversation => conversation.participants[0]._id === contact._id).participants[0].name,
        userProfilePic: conversations.find(conversation => conversation.participants[0]._id === contact._id).participants[0].profilePic,
      })
    }
    else {
      setSelectedConversation({
        _id: '',
        userId: contact._id,
        name: contacts.find(person => person._id === contact._id).name,
        userProfilePic: contacts.find(person => person._id === contact._id).profilePic
      })
    }

    // Navigate to the target page
    navigate(`/chat/${contact._id}`);
  };

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"2"}
      _hover={{
        cursor: 'pointer',
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white"
      }}
      borderRadius={"md"}
      bg={(colorMode === "light" ? "gray.300" : "dark")}
      onClick={handleClick} // Attach the click handler here
    >
      <WrapItem>
        <Avatar size={{
          base: "md",
          sm: "sm",
          md: "md"
        }}
          src={contact?.profilePic} >
          {isOnline ? <AvatarBadge boxSize={"1em"} bg={"green.500"} /> : ""}
        </Avatar>
      </WrapItem>
      <Stack direction={'column'} fontSize={"sm"}>
        <Text fontWeight={"700"} fontSize={17} display={"flex"} alignItems={"center"}>
          {contact?.name} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"sm"} gap={1} display={"flex"} alignItems={"center"}>
          {sender && 
          <Box color={!newMsg ? "blue.400" : ""}>
            <BsCheck2All size={16}  />
          </Box>
          }
          {lastMessage.length > 30 ? lastMessage.substring(0, 18) + '...' : lastMessage}
        </Text>
      </Stack>
      {newMsg &&
        <Box border="2px solid" borderColor="greenyellow" borderRadius="md" w={10} ml="auto">
          <Text fontSize={"sm"} textAlign={"center"} color={'greenyellow'}>
            new
          </Text>
        </Box>
      }
    </Flex>
  )
}

export default ContactList
