import { Flex, Input,Skeleton, SkeletonCircle,Box,Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ContactList from '../components/ContactList.jsx'
import Header from '../components/Header.jsx'
import useShowToast from '../CostomHooks/useShowToast.js'
import { useSocket } from '../context/SocketContext.jsx'
import { contactAtom } from '../atom/contactAtom.js'
import { useRecoilState } from 'recoil'

const HomePage = () => {

  //const [contacts, setContacts] = useState([]);
  const [contacts, setContacts] = useRecoilState(contactAtom)
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const showToast = useShowToast()
  const {socket,onlineUsers} = useSocket()

  useEffect(() => {
    setLoading(true)
    const getContacts = async () => {
      try {
        const res = await fetch('/api/users/getcontacts')
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error")
          return
        }
        setContacts(data);

      } catch (error) {
        showToast("Error", data.error, "error")
      } finally {
        setLoading(false)
      }
    }
    getContacts();
  }, [showToast])

  const handleSearchForContacts = (e) => {
    const value = e.target.value;
    if(value == ''){
      setFilteredContacts([])
    }
    else{
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }

  return <>
    <Header />
    <Flex mt={5} justifyContent="center">
      <Input
        placeholder='Search'
        _placeholder={{ color: 'gray.500' }}
        borderColor={'white'}
        type="text"
        border={'2px solid'}
        borderRadius={20}
        w={{ base: "90%", md: "50%" }} // Adjust width based on screen size
        onChange={handleSearchForContacts}
      />
    </Flex>
    {loading &&
      [...Array(10)].map((_, i) => (
        <Flex key={i} gap={4} mt={5} alignItems={'center'} p={"1"} borderRadius={"md"}>
          <Box>
            <SkeletonCircle size={"10"} />
          </Box>
          <Flex w={"full"} flexDirection={"column"} gap={3}>
            <Skeleton h={"10px"} w={"80px"} />
            <Skeleton h={"8px"} w={"90%"} />
          </Flex>
        </Flex>
      ))
    }
    {!loading && (
      <Flex flexDirection={'column'} mt={5} gap={4} overflow={'auto'} height={'75vh'} px={4}>
        {filteredContacts.length > 0 && filteredContacts?.map((contact) => (
          
          <ContactList
            key={contact._id}
            isOnline={onlineUsers.includes(contact._id)}
            contact={contact}
          />
          
        ))}
        {filteredContacts.length === 0 && contacts.length > 0 && contacts?.map((contact) => (
          
          <ContactList
            key={contact._id}
            isOnline={onlineUsers.includes(contact._id)}
            contact={contact}
          />
          
        ))}
        
        {contacts.length == 0 &&
          <Text className='gradient-text' >Add someone to contact to start converstation</Text>
        }

        <br />
        <br />
      </Flex>
    )}
  </>
}

export default HomePage
