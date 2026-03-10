import { AuthLayoutSplit } from "@/components/auth/auth-layout-split";
import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = () => {
  return ( 
    <AuthLayoutSplit>
      <NewVerificationForm />
    </AuthLayoutSplit>
   );
}
 
export default NewVerificationPage;