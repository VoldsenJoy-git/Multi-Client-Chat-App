import React, { useRef, useEffect, useState } from "react";

const Message = ({ message, userId, isSameSenderMargin, isSameUser }) => {
  const messageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    });

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, []);

  const { content, imageUrl, sender } = message;

  if (!content && !imageUrl) {
    return null; // Return null if both content and imageUrl are undefined or null
  }

  return (
    <div
      ref={messageRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease",
        backgroundColor: sender._id === userId ? "#BEE3F8" : "#B9F5D0",
        marginLeft: isSameSenderMargin,
        marginTop: isSameUser ? 3 : 10,
        borderRadius: "20px",
        padding: "5px 15px",
        maxWidth: "75%",
      }}
    >
      {imageUrl ? (
        imageUrl.includes(".png") ||
        imageUrl.includes(".jpg") ||
        imageUrl.includes(".jpeg") ? (
          <img src={imageUrl} alt="Image" style={{ maxWidth: "100%" }} />
        ) : imageUrl.includes(".mp4") ||
          imageUrl.includes(".mov") ||
          imageUrl.includes(".avi") ? (
          <video controls style={{ maxWidth: "100%" }}>
            <source src={imageUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) :
        imageUrl.includes(".pdf") ? (
          <iframe src={imageUrl} title="PDF Document" style={{ width: "100%", height: "500px" }} />
        ) 
        :
        imageUrl.includes(".txt") ? (
          <iframe src={imageUrl} title="TEXT Document" style={{ width: "100%", height: "500px" }} />
        ) 
        :
         (
          <p>File type not supported</p>
        )
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default Message;
