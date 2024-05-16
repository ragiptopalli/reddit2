import { PostgresDataSource } from './db/data-source';
import { Post } from './db/entities/Post';

const main = async () => {
  try {
    await PostgresDataSource.initialize();

    const post = new Post();

    post.text = 'hello hello';
    post.title = 'This is the new title';

    await PostgresDataSource.manager.save(post);

    const foundPost = await PostgresDataSource.manager.find(Post);
    console.log(foundPost, 'FOUND POST');
  } catch (err) {
    console.error(err);
  }
};

main().catch((err) => console.error(err));
