import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  // const files = api.example.getFiles.useQuery();
  const document = `
  Student Acceptance Manual
  Table of Contents
  
     
  Prepared by: College Center for Advising Services, Lattimore 312 – Revised November 6, 2017
   
  Welcome to the Take Five Scholars Program!  You are now part of a select group of students who will enrich their undergraduate programs through a fifth year of study.  Below are the terms for participation in the Take Five J.B. Rodgers, in the Center for Advising Services at jr007h@ur.rochester.edu or 275-2354 (Lattimore 312) if questions or problems arise.  Other advisors available to answer your questions are Lisa Norwood (275-4155, Hajim School of Engineering and Applied Sciences) and John Hain (274-1563), Eastman School of Music, Assistant Dean of Academic Affairs).  General questions can also be directed to the Take Five Secretary, Shandra Kieffer 275-2354 (Lattimore 312), Shandra.kieffer@rochester.edu.
  
  
  I.  THE TAKE FIVE REVIEW BOARD
  
    The Take Five Review Board is comprised of faculty, administrators, and students who evaluate Take Five proposals and monitor the guidelines of the program.  Each year, we invite fifth-year Take Five Scholars to apply to serve as the student representative on the Review Board.
  
  
  II. ACADEMIC PROGRESS
  
  Expectations:
  
    We assume that you will continue to earn satisfactory grades in all your courses.  Failure to do so will result in a review of your Take Five status.  We also assume that you will complete at least 128 credit hours prior to the start of your tuition-free year/semester.  Keep in mind that the Take Five Scholars Program involves the integration of Take Five courses, when possible, into your regular four-year curriculum.  This means that you will replace some of your regular coursework with Take Five courses.  In doing so, you will move some of your graduation requirements — courses needed to satisfy the Rochester Curriculum, major requirements, or electives — into your fifth year/ninth semester.  Note, that courses offered by Medicine & Dentistry, Nursing, Warner, or graduate courses at the Simon School may NOT be taken during a tuition-free semester.  The number of credits earned by the end of the fourth year, however, still should meet the 128 credit hour requirement.  Once you begin your tuition-free fifth year/semester, you must receive final grades for all of your Take Five courses.  Failure to complete your Take Five Scholars Program may delay your graduation and have financial repercussions should you withdraw after beginning the 5th year/tuition-free term(s).
  
  Course Substitutions:
  
        If you find that you have a scheduling conflict or that one of your proposed Take Five courses is not offered during the semester indicated on your proposal, you need to obtain approval to substitute other courses consistent with the theme of your approved program.  To obtain permission, you must submit a Take Five Petition form, available online at the following website: http://www.rochester.edu/college/CCAS/students/opportunities/takefive/petition.html. The Take Five Review Board assumes that students will follow their approved programs; therefore, it is essential that you discuss any changes you wish to make in your course schedule with the Take Five Program administrator in Lattimore 312 (275-2354).  Any substantial change will require a resubmission of your proposal to the Review Board for re-evaluation, and in such cases approval by the Board cannot be assumed.
  

 
  VI.  CONCLUSION
  
    Despite our best efforts to adjust systems to accommodate a fifth year of undergraduate study, some problems may still occur.  Some University divisions keep their own records that are not touched by modifications to the centralized record system, and they may still indicate your original graduation date.  If you encounter any difficulties that result from your special status, please contact the Take Five Program Administrator, who can contact the appropriate people and work with you to resolve the problem.  
  
  Once again, congratulations on your admission to Take Five.  We look forward to working with you on your new program of study.
  `;
  const summary = `
  A student acceptance manual for the University of Rochester Take Five Scholars program.
  `;
  const document2 = `\n\nThe University of Waterloo is pleased to offer you an opportunity to complete a sixth year of study at the University.
  
  This special program, known as Take Six, is designed for students who have demonstrated outstanding academic ability and who wish to pursue an independent project in a field of their choice.  This program is open to students in all schools and colleges of the University.
  
  The Take Six Program is designed to provide you with the opportunity to:
  1. Bake cakes at the university of Waterloo
  2. Make sculptures
  3. Get a degree
  `;

  const document3 = `\n\nDESCRIPTION

Job summary
About Twitch

Launched in 2011, Twitch is a global community that comes together each day to create multiplayer entertainment: unique, live, unpredictable experiences created by the interactions of millions. We bring the joy of co-op to everything, from casual gaming to world-class esports to anime marathons, music, and art streams. Twitch also hosts TwitchCon, where we bring everyone together to celebrate, learn, and grow their personal interests and passions. We’re always live at Twitch. Stay up to date on all things Twitch on Linkedin, Twitter and on our Blog.

About the Role

Twitch is building the future of interactive entertainment. As a Software Engineer you'll work as part of a team to build the system that connects our creators with hundreds of millions of Twitch viewers. We're looking for interest and experience in server-side programming (web architecture, SOA, database architecture) and passion for building clean, scalable, and well-tested systems using Golang and AWS.

This position can also be located in Irvine, CA; Seattle, WA

You Will:

    Design, deliver, and improve performant, reliable, and high-performance systems
    Embrace and champion engineering best practices within your group and Twitch
    Produce clean, high-quality code, tests, and documentation
    Actively participate in code and design reviews with peers and partners
    Contribute engineering input and feedback into product planning processes
    Partner with fellow engineering teams to accomplish complex projects together

BASIC QUALIFICATIONS

You Have:

    Willingness to try new things and work with a diverse group of people
    Bachelor's degree in Computer Science or related field or equivalent industry experience as a Software Engineer
    A foundation in data structures and algorithms. Familiarity with scalability, concurrency, API design, data modeling, and distributed systems fundamentals

PREFERRED QUALIFICATIONS

Bonus Points

    Familiarity with AWS infrastructure
    Experience with email / notifications technologies
    Experience writing Go in production systems

`;
  const prompt = `You are a document summarizer. \n\nSTART DOCUMENT:\n\n${document}\n\nEND DOCUMENT\n\nSUMMARY:${summary}\n\nEND SUMMARY\n\nSTART DOCUMENT:\n\n${document3}\n\nEND DOCUMENT\n\nSUMMARY:`;

  const { data: completionData } = api.example.getCompletion.useQuery(
    {
      prompt,
    },
    {
      // enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  console.log("data", completionData);

  return (
    <>
      <Head>
        <title>OpenAI Files</title>
        <meta name="description" content="Created by @esmakov" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-center text-4xl font-bold">File Summarizer</h1>
        {completionData?.map((choice) => {
          return <p className="text-center text-2xl">{choice.text}</p>;
        })}
        <form action="">
          <input
            className="rounded-md border-2 border-gray-400 p-2 outline-none"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
