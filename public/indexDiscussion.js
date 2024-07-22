
document.addEventListener("DOMContentLoaded", function() {
  const discussionForm = document.getElementById('discussionForm');
  const discussionList = document.getElementById('discussionList');

  const fetchDiscussions = async () => {
      try {
          const response = await fetch('/api/discussions');
          const data = await response.json();

          discussionList.innerHTML = '';
          data.discussions.forEach(discussion => renderDiscussion(discussion));
      } catch (error) {
          console.error('Error fetching discussions:', error);
      }
  };

  const renderDiscussion = (discussion) => {
      const discussionElement = document.createElement('div');
      discussionElement.classList.add('discussion');
      discussionElement.innerHTML = `
          <h2>${discussion.title}</h2>
          <p>${discussion.content}</p>
          <div class="commentList" data-discussion-id="${discussion._id}"></div>
          <form class="commentForm" data-discussion-id="${discussion._id}">
              <textarea name="content" placeholder="Your comment" required></textarea>
              <button type="submit">Post Comment</button>
          </form>
      `;
      discussionList.appendChild(discussionElement);

      const commentForm = discussionElement.querySelector('.commentForm');
      commentForm.addEventListener('submit', handleCommentSubmit);

      fetchComments(discussion._id);
  };

  const handleCommentSubmit = async (event) => {
      event.preventDefault();
      const commentForm = event.target;
      const discussionId = commentForm.getAttribute('data-discussion-id');
      const formData = new FormData(commentForm);
      const plainFormData = Object.fromEntries(formData.entries());
      const formDataJsonString = JSON.stringify({
          ...plainFormData,
          discussionId
      });

      try {
          const response = await fetch('/api/discussions/comments', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: formDataJsonString
          });
          const data = await response.json();
          renderComment(data.discussion.comments[data.discussion.comments.length - 1], discussionId);
          commentForm.reset();
      } catch (error) {
          console.error('Error posting comment:', error);
      }
  };

  const fetchComments = async (discussionId) => {
      try {
          const response = await fetch(`/api/discussions/${discussionId}/comments`);
          const data = await response.json();

          const commentList = document.querySelector(`.commentList[data-discussion-id="${discussionId}"]`);
          commentList.innerHTML = '';
          data.comments.forEach(comment => renderComment(comment, discussionId));
      } catch (error) {
          console.error('Error fetching comments:', error);
      }
  };

  const renderComment = (comment, discussionId) => {
      const commentList = document.querySelector(`.commentList[data-discussion-id="${discussionId}"]`);
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `
          <p><strong>${comment.author}</strong>: ${comment.content}</p>
      `;
      commentList.appendChild(commentElement);
  };

  discussionForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(discussionForm);
      const plainFormData = Object.fromEntries(formData.entries());
      const formDataJsonString = JSON.stringify(plainFormData);
      try {
          const response = await fetch('/api/discussions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: formDataJsonString
          });
          const data = await response.json();
          renderDiscussion(data.discussion);
          discussionForm.reset();
      } catch (error) {
          console.error('Error creating discussion:', error);
      }
  });

  fetchDiscussions();
});




