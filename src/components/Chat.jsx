import {
  Button,
  ButtonBase,
  CircularProgress,
  Divider,
  Input,
  InputBase,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
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
import SendIcon from "@mui/icons-material/Send";
import StyledMessage from "./StyledMessage";

export default function Chat(props) {
  const [chain, setChain] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageChainID, setMessageChainID] = useState(null);
  const [messageToSend, setMessageToSend] = useState(null);
  const [tempMessage, setTempMessage] = useState(null);
  let mountRef = useRef(true);
  let idMountRef = useRef(true);

  // !!! FUTURE ME !!!
  // WRITE THE FOLLOWING FUNCTIONS
  /*
     - update DB for user with messageChainID -> userData.friends.message_chain: 'idvalue'
     - update DB for friend with '' '' ''
     - function for sending messages to DB eg. addMessage() then maybe grab new messages? do more research into how to handle this without making too many requests
     - functions for deleting convos
     - figure out why leaving and coming back to this component breaks it
  */

  // Sorts messages based on timestamp
  const compareTimestamp = (a, b) => {
    if (a.timestamp < b.timestamp) {
      return -1;
    }
    if (a.timestamp > b.timestamp) {
      return 1;
    }
    return 0;
  };
  const handleSendEvent = (e) => {
    setTempMessage("");
    setMessageToSend(tempMessage);
  };
  const handleInputChangeEvent = (e) => {
    setTempMessage(e.target.value);
  };
  //Handles message_chain document in firestore
  useEffect(() => {
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
        const querySnapshot = await getDocs(q);
        console.log("Queried");
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
        setMessageChainID(props.userData.friends[props.friend].message_chain);
        setChain(chain);
      }
    }

    if (mountRef.current) {
      mountRef.current = false;
      console.log(messageChainID);
      getAndCreateMessageChain();
      //getAndCreateMessageCollection();
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      //Cleanup useEffect
      console.log("Cleanup Chat");
      clearTimeout(timer);
      //mountRef.current = true;
    };
  }, []);
  // messageChainID issues with being undefined so I moved it here...maybe there's a better solution
  //Handles messages collection in firestore
  useEffect(() => {
    //console.log(messageChainID);
    async function getMessageCollection() {
      const querySnapshot = await getDocs(
        collection(db, `message_chains/${messageChainID}/messages`)
      );
      console.log("Collecting Messages");
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
      const docRef = await addDoc(
        collection(db, `message_chains/${messageChainID}/messages`),
        {
          content: "New Convo",
          sender: "test",
          timestamp: serverTimestamp(),
        }
      );
      console.log("Creating New Messages");
      console.log(docRef.id);
      return docRef;
    }
    async function getAndCreateMessageCollection() {
      console.log("Started Message Collection...");
      const messageArray = await getMessageCollection();
      if (!messageArray[0]) {
        const createMessage = await createMessageCollection();
        //setMessages([...createMessage]);
        const addMessage = await getMessageCollection();
        setMessages([...addMessage]);
      } else {
        setMessages([...messageArray]);
      }
    }
    if (idMountRef.current) {
      //idMountRef.current = false;
      if (messageChainID) {
        getAndCreateMessageCollection();
      }
    }
    return () => {
      //Cleanup
    };
  }, [messageChainID]);
  // This useEffect handles sending messages to DB and refreshing the messages state
  useEffect(() => {
    async function getMessageCollection() {
      const querySnapshot = await getDocs(
        collection(db, `message_chains/${messageChainID}/messages`)
      );
      console.log("Collecting Messages");
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
    async function sendMessage(messageText) {
      try {
        const docRef = await addDoc(
          collection(db, `message_chains/${messageChainID}/messages`),
          {
            content: messageText,
            sender: props.userID,
            timestamp: serverTimestamp(),
          }
        );
        console.log("Sending message");
        console.log(docRef.id);
        return docRef;
      } catch (error) {
        console.error(error);
      }
    }
    async function messageWrapFunc() {
      await sendMessage(messageToSend);
      //Collect new messages
      const messageArray = await getMessageCollection();
      setMessages([...messageArray]);
    }
    if (messageToSend !== null) {
      messageWrapFunc();
    }
    return () => {
      if (messageToSend == null) {
        return;
      } else {
        setMessageToSend(null);
      }
    };
  }, [messageToSend]);
  //Debugging state
  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <ThemeProvider theme={props.theme}>
      <Typography
        variant="h4"
        sx={{ paddingTop: "10px", paddingBottom: "8px" }}
      >
        Chat
      </Typography>
      <Divider variant="fullWidth" />
      <Box
        sx={{
          display: "flex",
          height: "100%",
          maxHeight: "100%",
          flexDirection: "column",
          overflowY: "scroll",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1rem",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          messages.sort(compareTimestamp).map((el, index) => {
            return (
              <StyledMessage
                theme={props.theme}
                key={index}
                userID={props.userID}
                message={el}
                id={index}
              />
            );
          })
        )}
      </Box>
      <Box
        sx={{
          bgcolor: "#0060c1",
          padding: "8px",
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >
        <InputBase
          value={tempMessage}
          sx={{
            bgcolor: props.theme.palette.background.default,
            borderRadius: ".5rem",
            paddingLeft: "8px",
            height: "2.7rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          placeholder="Send Message..."
          variant="outlined"
          size="small"
          onChange={handleInputChangeEvent}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendEvent();
            }
          }}
        />
        <Button variant="contained" color="success" onClick={handleSendEvent}>
          <SendIcon />
        </Button>
      </Box>
    </ThemeProvider>
  );
}
