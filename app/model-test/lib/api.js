import { baseurl, viewurl } from "@/app/config";
import axios from "axios";

export async function fetchAllInit(skip) {
  try {
    const { data } = await axios.get(
      `${baseurl}/user-exam-initiation/find-global-user-initiation?skip=${skip}`,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchLastInit() {
  try {
    const { data } = await axios.get(
      `${baseurl}/user-exam-initiation/find-global-user-last-initiation`,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function AttachedQuestionsWithInit(initId) {
  try {
    if (!initId) return;
    const { data } = await axios.get(
      `${baseurl}/user-model-question/get-mcq-by-init-public-access/${initId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function startExamApi(examId, token) {
  try {
    const { data } = await axios.get(
      `${baseurl}/user-model-question/get-mcq-by-init/${examId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
}

const appendBalance = async (value, controllerId) => {
  try {
    await axios.get(`${baseurl}/auth/user/add-balance/${value}/${controllerId}`);
  } catch (error) {
    console.log(error);
  }
};

const checkModel = async (modelId, countedQuestions, controllerId) => {
  const stored = localStorage.getItem("model_ids");
  const questionId = stored ? JSON.parse(stored) : [];
  if (!questionId.includes(modelId)) {
    questionId.push(modelId);
    localStorage.setItem("model_ids", JSON.stringify(questionId));
    await appendBalance(countedQuestions, controllerId);
    return false;
  } else return true;
};

export async function submitAnswer(answerSheet, msg1, msg2) {
  const {
    totalQuestions,
    obtainedMark,
    submittedData,
    modelTestId,
    examee,
    exameeId,
    controllerId,
  } = answerSheet;
  const isExist = await checkModel(modelTestId, submittedData.length, controllerId);
  callCounterFunction(modelTestId);
  if (totalQuestions * (2 / 3) >= obtainedMark) {
    const query = encodeURIComponent(JSON.stringify(answerSheet));
    window.location.href = `${viewurl}/model-test/exam-result-under-fit?data=${query}`;
    return;
  }
  try {
    const { data } = await axios.post(
      `${baseurl}/user-exam-initiation/submit-answer`,
      answerSheet,
    );

    const query = encodeURIComponent(JSON.stringify(data?.redirectedData));
    window.location.href = `${viewurl}/model-test/exam-result?data=${query}`;
    if (data.status == false) {
      alert(`${msg2} ${data.msg}`);
    } else {
      alert(`${msg1} ${data.msg}`);
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function callEachUserResult(exameeData) {
  try {
    const { data } = await axios.post(
      `${baseurl}/user-exam-initiation/single-candidate-submission`,
      exameeData,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function meritListChart(initId) {
  try {
    const { data } = await axios.get(
      `${baseurl}/user-exam-initiation/examee-performance-list/${initId}`,
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function meritListChartWithPagination(
  initId,
  page,
  setPage,
  setLoad,
) {
  try {
    setLoad(true);
    const { data } = await axios.get(
      `${baseurl}/user-exam-initiation/examee-performance-pagination-list/${initId}/${page}`,
    );
    setPage((prev) => prev + 1);
    setLoad(false);
    return data;
  } catch (error) {
    console.log(error);
  }
}

//////////////////////////////////////////////////////////////
export const setRoundedFavicon = (url) => {
  return new Promise((resolve) => {
    // ✅ Prevent SSR breakage
    if (typeof window === "undefined") return resolve(url);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const size = 64; // favicon size
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // ✅ Draw circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // ✅ Draw image inside circle
      ctx.drawImage(img, 0, 0, size, size);

      // ✅ Return base64 favicon
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      // ❗ If image fails, return original URL
      resolve(url);
    };
  });
};

///////////////////////////////////////////////////////////////
export const evaluateExam = (data) => {
  const { examee, attatcedMcq } = data;

  // Create a map of submitted answers: index → pressed option number
  const submittedMap = new Map(
    examee?.submissions[0]?.submittedData?.map((item) => [
      item.index,
      item.pressed,
    ]),
  );

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const negativeMark = examee?.negativeMark;
  const evaluated = [];

  attatcedMcq.forEach((q, index) => {
    const pressed = submittedMap.get(index);

    if (pressed === undefined || pressed === null) {
      skipped++;
      evaluated.push({
        index,
        sub: q.subject,
        status: "skipped",
        pressed: null,
      });
      return;
    }

    if (pressed === q.correctAns) {
      correct++;
      evaluated.push({ index, sub: q.subject, status: "correct", pressed });
    } else {
      wrong++;
      evaluated.push({ index, sub: q.subject, status: "wrong", pressed });
    }
  });

  return {
    correct,
    wrong,
    skipped,
    evaluated,
    negativeMark,
  };
};

///////////////////////////////////////////////////////////////
export const evaluateExamForUnderFit = (questions, examData) => {
  // Create a map of submitted answers: index → pressed option number
  const submittedMap = new Map(
    examData?.submittedData?.map((item) => [item.index, item.pressed]),
  );

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const negativeMark = examData?.negativeMark;
  const evaluated = [];

  questions.forEach((q, index) => {
    const pressed = submittedMap.get(index);

    if (pressed === undefined || pressed === null) {
      skipped++;
      evaluated.push({
        index,
        sub: q.subject,
        status: "skipped",
        pressed: null,
      });
      return;
    }

    if (pressed === q.correctAns) {
      correct++;
      evaluated.push({ index, sub: q.subject, status: "correct", pressed });
    } else {
      wrong++;
      evaluated.push({ index, sub: q.subject, status: "wrong", pressed });
    }
  });

  return {
    correct,
    wrong,
    skipped,
    evaluated,
    negativeMark,
  };
};

const callCounterFunction = async (id) => {
  await axios.get(`${baseurl}/user-exam-initiation/examee-counter/${id}`);
};
