const express = require("express");
const multer = require("multer");
const { makeDoAuthMiddleware } = require("../auth/doAuthMiddleware");
const { showAllTransactions } = require("../controllers/transaction-controller/show-all-transactions");
const { createNewTransaction } = require("../controllers/transaction-controller/add-transaction");
const { showDetailTransaction } = require("../controllers/transaction-controller/show-transactions-detail");
const { removeTransaction } = require("../controllers/transaction-controller/delete-transaction");
const { updateTransaction } = require("../controllers/transaction-controller/edit-transaction");
const { upload, uploadToFirebase, deleteFromFirebase } = require("../services/file-upload.service");
const { verifyToken } = require("../auth/verifyToken");
// const { addTransaction, getTransaction, deleteTransaction ,updateTransaction} = require("../controllers/transaction-controller");
const doAuthMiddleware = makeDoAuthMiddleware("access");
const transactionsRouter = express.Router();

transactionsRouter.get("/all", doAuthMiddleware, (req, res) => {
  const userId = req.userClaims.sub;
  showAllTransactions({ userId })
    .then((transactions) => {
      return res.json(transactions);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "Failed to load transactions from database" });
    });
});

// const storage = multer.diskStorage({
//   destination: function (_, _, cb) {
//     cb(null, "uploads/receipt");
//   },
//   filename: function (_, file, cb) {
//     cb(null, file.originalname); //Appending extension
//   },
// });
// const upload = multer({ storage });


const uploadMiddleware = upload.single("img");

// new routes
// transactionsRouter.post("/transaction/add", verifyToken, uploadMiddleware, addTransaction)
// transactionsRouter.get("/transaction/:id", verifyToken, getTransaction)
// transactionsRouter.put("/transaction/edit/:id", verifyToken, uploadMiddleware, updateTransaction)
// transactionsRouter.delete("/transaction/delete/:id", verifyToken, deleteTransaction)






transactionsRouter.post(
  "/transaction/add",
  uploadMiddleware,
  doAuthMiddleware,
  async (req, res) => {
    if (!req.body) {
      return res.status(400).json({ error: "Please include a new Income" }); // Hata için doğru HTTP kodu
    }

    const userId = req.userClaims.sub;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Varsayılan olarak img alanını null yapıyoruz.
    let img = null;
    if (req.file) {
      img = req.file.originalname;
    }

    try {
      // Yeni transaction oluşturuluyor
      const addedTransaction = await createNewTransaction({ userId, img, ...req.body, req });

      // Eğer resim yüklendiyse Firebase'e yükle ve transaction'ı güncelle
      if (req.file) {
        const transactionId = addedTransaction.transactionId.toString();

        // Dosyayı yükle
        const uploadedFile = await uploadToFirebase(req.file, "img", transactionId, userId);
        const { insertResult, updateResult, ...rest } = addedTransaction
        // Transaction'ı güncelle
        const updatedTransaction = await updateTransaction(
          { ...rest, img: uploadedFile, req },
          userId
        );

        // Güncellenmiş transaction döndür
        return res.status(201).json(updatedTransaction);
      }

      // Eğer resim yoksa sadece transaction'ı döndür
      return res.status(201).json(addedTransaction);
    } catch (err) {
      console.error("Error adding transaction:", err);

      // Hata durumunda yanıt gönder
      return res.status(500).json({ error: "Failed to add new income to database." });
    }
  }
);


transactionsRouter.get("/transaction/:id", doAuthMiddleware, (req, res) => {
  const transactionId = req.params.id;
  const userId = req.userClaims.sub;
  showDetailTransaction({ transactionId, userId })
    .then((details) => res.json(details))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to show detailed transaction" });
    });
});


transactionsRouter.delete("/transaction/delete/:id", doAuthMiddleware, async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.userClaims.sub;

  try {
    // Transaction'u veritabanından sil
    const removeTransactionResult = await removeTransaction({ transactionId, userId, req });
    // Transaction ile ilişkili resmi sil
    if (removeTransactionResult?.value?.img?.url) {
      await deleteFromFirebase(removeTransactionResult.value.img.url);
    }
    res.json({ removeTransaction: removeTransactionResult });
  } catch (err) {
    console.error("Error deleting transaction or related image:", err);
    res
      .status(500)
      .json({ error: "Failed to remove transaction or related image." });
  }
});

transactionsRouter.put(
  "/transaction/edit/:id",
  uploadMiddleware,
  doAuthMiddleware,
  async (req, res) => {
    try {
      const transactionId = req.params.id;
      const userId = req.userClaims.sub;
      const income = req.body.income;

      // Varsayılan olarak img alanını null yapıyoruz.
      let img = null;

      if (req.file) {
        const file = req.file;
        // Resmi Firebase'e yükle ve URL'sini al
        const uploadedFile = await uploadToFirebase(file, "img", transactionId, userId);
        console.log("File uploaded:", uploadedFile);
        img = uploadedFile; // img alanını yüklenen dosyanın URL'si ile güncelle
      }

      const transactionUpdateInfo = {
        transactionId,
        name: req.body.name,
        amount: Number(req.body.amount),
        income: income === "true" ? true : false,
        createdAt: new Date(req.body.createdAt).getTime(),
        img, // Eğer img varsa URL, yoksa null olarak atanır
        req, // req objesini ekle
      };

      // Veritabanını güncelle
      const updatedTransaction = await updateTransaction(transactionUpdateInfo, userId);

      // Güncellenmiş veriyi döndür
      res.json(updatedTransaction);
    } catch (error) {
      console.error(error);
      res.status(500).json("Unknown error while editing a Transaction.");
    }
  }
);

transactionsRouter.delete("/delete-image", doAuthMiddleware, async (req, res) => {
  try {
    const { fileUrl } = req.body;
    await deleteFromFirebase(fileUrl);
    res.json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image." });
  }
});

module.exports = {
  transactionsRouter,
};
