import { baseurl, viewurl } from "@/app/config";
export async function generateMetadata({ params }) {
  const res = await fetch(`${baseurl}/user-exam-initiation/find-single-init/${params.token}`, {
    cache: 'no-store'
  });

  const data = await res.json();
 return {
     title:`${data.userId.name} - ${data.title} edu++`,
    description:data.userId.description,
    keywords: `${data.userId.name}, eduplusplus, job solution, bcs question bank`,
    alternates: {
      canonical: `${baseurl}/model-test/share/${params.token}`,
    },
    openGraph: {
    title:`${data.userId.name} - ${data.title} edu++`,
    description:data.userId.description,
      url:  `${baseurl}/model-test/share/${params.token}`,
      images: [
        {
          url: `${data.userId.profile}`, // you can dynamically generate this
          width: 630,
          height: 630,
          alt: data.name,
        },
      ],
      siteName: 'EDU ++',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
    title:`${data.userId.name} - ${data.title} edu++`,
     description:data.userId.description,
      images: [`${data.userId.profile}`],
    },
  };
  }
  export default function ShareExamLayout({ children }) {
    return <div>
        {children}
    </div>
  }//
  