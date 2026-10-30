import { baseurl, suburl } from "@/app/config";
import axios from "axios";

export const createExam =async (id,token,form)=>{
        const { data } = await axios.post(
        `${suburl}/user-exam-initiation/create-exam`,
        { userId:id, ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data
}


export const updateModel =async (id,form,token)=>{
        const { data } = await axios.post(
        `${baseurl}/user-exam-initiation/update-exam`,
        {id,form},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data
}

export const updateQuestion =async (id,form,token)=>{
        const { data } = await axios.post(
        `${baseurl}/user-model-question/update-mcq-in-init`,
        {id,form},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data
}

const deleteBalance = async ( controllerId) => {
  try {
    await axios.get(`${baseurl}/auth/user/delete-balance/${controllerId}`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteModel =async (id,token)=>{
   try {
            const { data } = await axios.post(
        `${baseurl}/user-exam-initiation/delete-exam`,
        {id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data
   } catch (error) {
      alert('Sorry this time. Try again later!')
   }
}
export const deleteQuestion =async (id,token)=>{
        const { data } = await axios.post(
        `${baseurl}/user-model-question/delete-mcq-in-init`,
        {id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data
}


 export const fetchExamModle = async (id,token) => {
    try {
      const { data } = await axios.get(
        `${baseurl}/user-exam-initiation/find-single-init/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };


  export const createQuestions = async (form,token)=> {
          const { data } = await axios.post(
            `${baseurl}/user-model-question/create-mcq-in-init`,
            form,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          return data
  }


 export const fetchQuestions = async (id,token) => {
    try {
      const { data } = await axios.get(
        `${baseurl}/user-model-question/get-mcq-by-init/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  export const publishExam = async(id,countQuestion,token) => {
           const {data} = await axios.post(
            `${baseurl}/user-exam-initiation/toggle-status`,
            { id, countQuestion },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert(data);
         return data
  }