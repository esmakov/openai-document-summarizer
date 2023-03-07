import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";

import * as pdfjs from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const SAMPLE_DOCUMENT = `
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
const SAMPLE_SUMMARY = `
A student acceptance manual for the University of Rochester Take Five Scholars program.
`;
const SAMPLE_DOCUMENT_2 = `\n\nThe University of Waterloo is pleased to offer you an opportunity to complete a sixth year of study at the University.

This special program, known as Take Six, is designed for students who have demonstrated outstanding academic ability and who wish to pursue an independent project in a field of their choice.  This program is open to students in all schools and colleges of the University.

The Take Six Program is designed to provide you with the opportunity to:
1. Bake cakes at the university of Waterloo
2. Make sculptures
3. Get a degree
`;

const SAMPLE_DOCUMENT_g3 = `\n\nDESCRIPTION

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

export const MAX_ALLOWED_RESPONSE_TOKENS = 200;

const Home: NextPage = () => {
  const [maxTokens, setMaxTokens] = useState(50);
  const [temperature, setTemperature] = useState(0.7);
  const [documentFile, setDocumentFile] = useState<File>();
  const [documentText, setDocumentText] = useState("");
  const [summaryText, setSummaryText] = useState("");

  let timeoutId = null;

  const prompt = `You are a document summarizer. \n\nSTART DOCUMENT:\n\n${SAMPLE_DOCUMENT}\n\nEND DOCUMENT\n\nSUMMARY:${SAMPLE_SUMMARY}\n\nSTART DOCUMENT:\n\n${documentText}\n\nEND DOCUMENT\n\nSUMMARY:`;

  const { data } = api.example.getCompletion.useQuery(
    {
      max_tokens: maxTokens,
      prompt,
      temperature,
    },
    {
      // enabled: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log("data", data);
        setSummaryText(data[0].text || "");
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleDocumentUpload = (e) => {
    e.preventDefault();

    if (!documentFile) return;

    const reader = new FileReader();

    // if the file is a pdf
    if (documentFile.type === "application/pdf") {
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const pages = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const text = textContent.items.map((item) => item.str).join(" ");
          pages.push(text);
        }

        const pdfText = pages.join("\n\n");
        // console.log(pdfText);
        // const pdfTextTruncated = pdfText.split("").slice(0, 200).join("");
        setDocumentText(pdfText);
      };

      reader.readAsArrayBuffer(documentFile);
    } else {
      reader.onload = (e) => {
        const text = e.target.result;
        setDocumentText(text as string);
        // console.log(text);
      };

      reader.readAsText(documentFile);
    }
  };

  const handleMaxTokensChange = (e) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setMaxTokens(Number(e.target.value));
    }, 500);
  };

  const handleTemperatureChange = (e) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setTemperature(Number(e.target.value));
    }, 500);
  };

  function handleCopy() {
    navigator.clipboard
      .writeText(summaryText)
      .then(() => alert("Text copied!"))
      .catch((err) => console.error("Could not copy text: ", err));
  }

  return (
    <>
      <Head>
        <title>OpenAI File Summarizer</title>
        <meta name="description" content="Created by @esmakov" />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js "></script>
        <link
          href="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/web/pdf_viewer.min.css "
          rel="stylesheet"
        ></link>
      </Head>
      <main className="flex flex-col items-center gap-4 p-4">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          Document Summarizer
        </h1>
        <h2>Powered by OpenAI's Completions API</h2>
        <p className="text-center text-xl">Upload a text file or PDF.</p>
        <form onSubmit={handleDocumentUpload} className="flex flex-col gap-2">
          <div className="flex justify-center gap-2">
            <input
              className="max-w-md rounded-md border-2 border-slate-400 bg-gray-100 p-2 text-gray-900 outline-none"
              type="file"
              onChange={handleFileChange}
            />
            <button type="reset">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </button>
          </div>

          {documentFile && (
            <>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <label htmlFor="document">Document:</label>
                  <textarea
                    name="document"
                    id="document"
                    rows={8}
                    className="text-md wrap rounded-md border-2 border-slate-400 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-300"
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex flex-col items-center">
                  <label htmlFor="summary">Summary:</label>
                  <textarea
                    name="summary"
                    id="summary"
                    rows={8}
                    className="text-md wrap rounded-md border-2 border-slate-400 p-2 text-gray-900 shadow-sm outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-300"
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                  ></textarea>
                </div>

                <button type="button" onClick={handleCopy}>
                  {/* From heroicons.com */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center gap-2">
                <label htmlFor="">Max tokens: {maxTokens}</label>
                <input
                  type="range"
                  min="0"
                  max={MAX_ALLOWED_RESPONSE_TOKENS}
                  onChange={handleMaxTokensChange}
                />
              </div>
              <div className="flex justify-center gap-2">
                <label htmlFor="">Temperature: {temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  onChange={handleTemperatureChange}
                />
              </div>
              <button
                type="submit"
                className="rounded-md border-2 border-slate-500 p-2 px-6 outline-none"
              >
                Summarize
              </button>
            </>
          )}
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
