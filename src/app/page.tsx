'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabaseClient } from '@/utils/supabaseClient';
import Nav from "@/components/Nav/index";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  // const supabase = createClient(supabaseUrl, supabaseKey);

  const CelebrityProfileCard = ({ profile }: { profile: any }) => (
    <div className="max-w-sm rounded overflow-hidden shadow-md m-4 h-1/2">
      <img
        src={profile.image}
        alt={profile.name}
        className="w-full h-64 object-cover"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{`${profile.name}`}</div>
        <p><span className="text-red-900 text-xm">BIO: </span>{profile.bio}</p>
        <p><span className="text-red-900 text-xm">Social: </span><a href={profile.twitter_link} target='_blank' className="text-blue-500 underline">Twitter</a></p>
      </div>
      <div className="flex justify-start">
        {profile.types.split(',').map((tag: string, index: number) => (
          <p className="text-sm border border-gray-400 rounded-lg py-1 px-4 m-1" key={index}>
            {tag}
          </p>
        ))}
      </div>

    </div>
  );

  useEffect(() => {
    fetchbuilders();
  }, []);

  // fetch builders from supabase
  const fetchbuilders = async () => {
    const { data, error } = await supabaseClient
      .from('builders')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.log(error);
    } else {
      console.log("data11", data);
      setSearchResults(data as never[]);
    }
  };

  const postToSetup = async () => {
    const res = await fetch('/api/config-table', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({
      //   builders: builders,
      // }),
    });
    const data = await res.json();
  };

  const handleChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // VECTTOR SEARCH
    if (searchTerm.trim() === '') {
      // If the search term is empty, fetch the original list from Supabase
      await fetchbuilders();
    } else {
      const semanticSearrch = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm,
        }),
      });

      const semanticSearrchResponse = await semanticSearrch.json();
      setSearchResults(semanticSearrchResponse.data);
    }
  };

  return (
    <div className="py-16 w-full flex justify-center items-center bg-gray-100 flex-col overflow-y-scroll">
      {/* <Nav /> */}
      <form
        onSubmit={handleSubmit}
        className="m-16 bg-white rounded-lg shadow-md flex w-full md:w-1/2 p-4"
      >
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow text-lg font-light focus:outline-none"
          value={searchTerm}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-r-lg"
        >
          Search
        </button>
      </form>
      <div className="flex flex-wrap justify-center overflow-y-auto">
        {searchResults.map((profile, index) => (
          <CelebrityProfileCard key={index} profile={profile} />
        ))}
      </div>
      {/* <button
        className="px-4 py-2 bg-green-500 text-white rounded-r-lg"
        onClick={postToSetup}
      >
        Setup
      </button> */}
    </div>
  );
}
