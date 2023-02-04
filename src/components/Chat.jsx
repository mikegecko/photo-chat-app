import { Divider, ThemeProvider, Typography } from "@mui/material";
import { create } from "@mui/material/styles/createTransitions";
import { Box } from "@mui/system";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, messageChainsRef } from "../App";

export default function Chat(props) {
  const [chain, setChain] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageChainID, setMessageChainID] = useState(null);
  let mountRef = useRef(true);
  let idMountRef = useRef(true);


  useEffect(() => {
    // Creation methods broken AF probably need to rewrite this whole compoenent...maybe move async stuff into main component?
    // !!! useRef workaround is ill-advised, look into other solutions
    setLoading(true);
    async function createMessageChain() {
      try {
        const docRef = await addDoc(collection(db, "message_chains"), {
          timestamp: serverTimestamp(),
          users: [props.userID, props.userData.friends[props.friend].id],
        });
        // This docRef.id needs to be added to message_chain in firestore for both users
        // Currently only updates userData state -> useEffect((),[userData]) -> firestore update function?
        const newUserData = {
          ...props.userData,
          friends: [...props.userData.friends],
        };
        newUserData.friends[props.friend].message_chain = docRef.id;
        props.setStateOfUserData(newUserData);
        return docRef;
      } catch (error) {
        console.error(error);
      }
    }
    async function getMessageChain() {
      try {
        const q = query(
          messageChainsRef,
          where(
            "__name__",
            "==",
            props.userData.friends[props.friend].message_chain
          )
        );
        console.log("Queried");
        const querySnapshot = await getDocs(q);
        let i;
        //This could cause bugs if there is more than one result for query
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            i = doc;
            console.log(doc.id);
          } else {
            console.log("Could not retrieve message_chain");
          }
        });
        return i;
      } catch (error) {
        console.error(error);
      }
    }

    async function getAndCreateMessageChain() {
        const chain = await getMessageChain();
        if (!chain) {
          const createChain = await createMessageChain();
          setMessageChainID(createChain.id);
          // Somehow get this id to update message_chain prop and update document in DB
          setChain(createChain);
        } else {
          setChain(chain);
        }
    }

    
    if (mountRef.current) {
      mountRef.current = false;
      getAndCreateMessageChain();
      //getAndCreateMessageCollection();
    }
    setLoading(false);
    return () => {
      //Cleanup useEffect
    };
  }, []);
  // messageChainID issues with being undefined so I moved it here...maybe there's a better solution
  useEffect(() => {
    console.log(messageChainID);
    async function getMessageCollection() {
      const querySnapshot = await getDocs(collection(db,`message_chains/${messageChainID}/messages`));
      console.log('Collecting Messages');
      const messageArray = [];
      querySnapshot.forEach((message) => {
        if (message.exists()) {
          messageArray.push(message.data());
        } else {
          console.log("Could not retrieve message");
        }
      });
      return messageArray;
    }
    async function createMessageCollection() {
      // Make this first message more unique and add data - this first message will be hidden from the convo and serve as a data manager for the convo
      const docRef = await addDoc(collection(db,`message_chains/${messageChainID}/messages`), {
        content: "New Convo",
        timestamp: serverTimestamp(),
      });
      console.log('Creating New Messages');
      console.log(docRef.id);
      return docRef;
    }
    async function getAndCreateMessageCollection() {
      console.log('Started Message Collection...');
      const messageArray = await getMessageCollection();
      if (!messageArray[0]) {
        const createMessage = await createMessageCollection();
        //setMessages([...createMessage]);
        const addMessage = await getMessageCollection();
        setMessages([...addMessage]);
      }
      else{
        setMessages([...messageArray]);
      }
    }
    if(idMountRef.current){
      //idMountRef.current = false;
      if(messageChainID){
        getAndCreateMessageCollection();
      }
    }
    return () => {
      //Cleanup
    }
  }, [messageChainID])

  useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <ThemeProvider theme={props.theme}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{ paddingTop: "10px", paddingBottom: "8px" }}
        >
          Chat
        </Typography>
        <Divider variant="fullWidth" />
        {/* {loading ? <Box>Loading</Box> : messages.map((el,index) => {
        return(
            <Box key={index}>{el.content}</Box>    
        )
      })} */}
      </Box>
    </ThemeProvider>
  );
}
