import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import getRandomImage from "../utils/getRandomImage";
import { ethers } from "ethers";
import connectContract from "../utils/connectContract";
import { TagsInput } from "react-tag-input-component";

export default function CreateEvent() {
  const [memoryName, setMemoryName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [friends, setFriends] = useState([]);
  const [eventLink, setEventLink] = useState("");
  const [sPublic, setPublic] = useState(false);
  const [eventDescription, setEventDescription] = useState("");
  const [photo, setPhoto] = useState();

  useEffect(() => {
    console.log("memory name:", memoryName);
    console.log("eventDaate:", eventDate);
    console.log("friends:", friends);
    console.log("show publicly?:", sPublic);
    console.log("event description:", eventDescription);
    console.log("image:", photo);
  }, [memoryName, eventDate, friends, sPublic, eventDescription, photo]);

  const changeHandler = (event) => {
		setPhoto(event.target.files[0]);
	};

  async function handleSubmit(e) {
    console.log("handle submit function called");
    e.preventDefault();
    // const formData = new FormData();

		// formData.append('File', photo);

    const body = {
      //the stuff that we're sending to web3storage - aka everything off-chain
      name: memoryName,
      description: eventDescription,
      link: eventLink,
      image: photo
    };

    //data that we're storing on-chain with our smart contract:
    //timestamp
    //friends
    //cretor of the memory
    //public boolean

    try {
      console.log("are you even getting inside the try?");
      const response = await fetch("/api/storemem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        alert("Oops! Something went wrong. Please refresh and try again.");
      } else {
        console.log("Form successfully submitted!");
        let responseJSON = await response.json();
        await createEvent(responseJSON.cid);
      }
      // check response, if success is false, dont take them to success page
    } catch (error) {
      alert(
        `Oops! Something went wrong. Please refresh and try again. Error ${error}`
      );
    }
  }

  const createEvent = async (cid) => {
    try {
      const memoryContract = connectContract();

      if (memoryContract) {
        let eventDateAndTime = new Date(`${eventDate} ${eventTime}`);
        let eventTimestamp = eventDateAndTime.getTime();
        let eventDataCID = cid;

        const txn = await memoryContract.createNewMemory(
          eventDataCID,
          eventTimestamp,
          sPublic,
          friends,
          { gasLimit: 900000 }
        );
        console.log("Minting...", txn.hash);
        console.log("Minted -- ", txn.hash);
      } else {
        console.log("Error getting contract.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // disable scroll on <input> elements of type number
    document.addEventListener("wheel", (event) => {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Create your memories | blndr </title>
        <meta
          name="description"
          content="Create your virtual event on the blockchain"
        />
      </Head>
      <section className="relative py-12">
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl mb-4">
          Save your memories ~forever~
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 divide-y divide-gray-200"
        >
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="memoryname"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Memory name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  id="memory-name"
                  name="memory-name"
                  type="text"
                  className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  required
                  value={memoryName}
                  onChange={(e) => setMemoryName(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Date & time
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Your event date and time
                </p>
              </label>
              <div className="mt-1 sm:mt-0 flex flex-wrap sm:flex-nowrap gap-2">
                <div className="w-1/2">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    id="time"
                    name="time"
                    type="time"
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="max-capacity"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Friends
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Add the wallet address of friends who were present.
                </p>
              </label>
              {/* <div className="border-2 border-red mt-1 rounded-md max-w-2xl"> */}
              <div>
                <TagsInput
                  value={friends}
                  onChange={setFriends}
                  name="tags"
                  placeHolder="vitalik.eth"
                />
                {/* <input
                    type="number"
                    name="friends-address"
                    id="friends-address"
                    placeholder="0x00000000000000"
                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border border-gray-300 rounded-md"
                    value={friends}
                    onChange={(e) => addToFriendsArray(e.target.value)}
                  /> */}
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="event-link"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Associated Links
                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                  Add tweets, websites, etc. related to this memory
                </p>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <input
                  id="event-link"
                  name="event-link"
                  type="text"
                  className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  required
                  value={eventLink}
                  onChange={(e) => setEventLink(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Memory description
                <p className="mt-2 text-sm text-gray-400">
                  All the deets you want to treasure forever
                </p>
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="about"
                  name="about"
                  rows={10}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Upload Photo
                <p className="mt-2 text-sm text-gray-400">
                  Upload a photo related to this memory
                </p>
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={changeHandler}
              />
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Make memory public?
                <p className="mt-2 text-sm text-gray-400">
                  By clicking this, your memory will be viewable by anyone.
                </p>
              </label>
              <input
                id="public"
                name="public"
                type="checkbox"
                className="block shadow-sm sm:text-sm border border-gray-300 rounded-md"
                required
                value={sPublic}
                onChange={(e) => setPublic(!sPublic)}
              />
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <Link href="/">
                <a className="bg-white py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </a>
              </Link>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create
              </button>
            </div>
          </div>
        </form>

        {/* <section className="flex flex-col items-start py-8">
            <p className="mb-4">Please connect your wallet to create events.</p>
          </section> */}
      </section>
    </div>
  );
}
