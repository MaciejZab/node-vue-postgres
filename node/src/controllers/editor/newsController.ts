import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { News } from "../../orm/entity/news/NewsEntity";

const newsTmp = {
  contentFiles: undefined,
};

const addNews = async (req: Request, res: Response) => {
  try {
    // const body = req.body;
    // const base = JSON.parse(body.base);
    // const bgImage = JSON.parse(body.bgImage);
    // let newNews: News;

    // switch (req.headers.ckeditor) {
    //   case "true":
    //     newsTmp.contentFiles = req.files;
    //     break;

    //   default:
    //     newNews = new News(base.ref, base.title, base.subtitle, base.content);
    //     console.log(newNews);
    //     console.log("---");
    //     console.log(bgImage);
    //     console.log("---");
    //     console.log(newsTmp.contentFiles);

    //     newsTmp.contentFiles = undefined;
    //     break;
    // }
    console.log(req.headers);
    console.log(req.files);

    res.status(200).json({
      added: {},
      message: "News added successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to add news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

const getNews = async (_req: Request, res: Response) => {
  try {
    const allNews = new News();

    res.status(200).json({
      news: allNews,
      message: "News retrieved successfully.",
      statusMessage: HttpResponseMessage.PUT_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving news:", error);
    res.status(404).json({
      message: "Unknown error occurred. Failed to retrieve news.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { addNews, getNews };
