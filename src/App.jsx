import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const getPosts = async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  };

  const addPost = (newPost) => {
    axios.post("http://localhost:4000/posts", {
      title: newPost.title,
      views: newPost.views,
    });
  };

  const [title, setTitle] = useState();
  const [views, setViews] = useState();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      QueryClient.invalidateQueries(["posts"]);
    },
  });

  if (isLoading) {
    return <h4>로딩중..</h4>;
  }

  if (isError) {
    return <h4>오류가 발생했습니다..</h4>;
  }

  return (
    <div>
      <input
        placeholder="title"
        value={title}
        onChange={(e = setTitle(e.target.value))}
      />
      <input
        placeholder="views"
        value={views}
        onChange={(e = setViews(e.target.value))}
      />
      <button
        onClick={() => {
          mutation.mutate({
            title,
            views,
          });
        }}
      >
        제출
      </button>
      {data.map((post) => {
        return (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.views}</p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
