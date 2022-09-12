import { GetServerSideProps, NextPage } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

interface ProtectedProps {
  session: Session;
}

const Protected: NextPage<ProtectedProps> = ({ session }) => {
  const { status, data } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [router, status]);

  return (
    <div>
      <h1>Protected</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <h1>SSR Session</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default Protected;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
