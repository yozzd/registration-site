import { createAlova } from 'alova';
import GlobalFetch from 'alova/GlobalFetch';

const useUserStore = defineStore('user', () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const headers = {
    Authorization: token.value,
    'Content-Type': 'application/json;charset=UTF-8',
  };

  const defaultInstance = createAlova({
    baseURL: config.public.apiUrl,
    requestAdapter: GlobalFetch(),
    responded: {
      onSuccess: async (response) => {
        const json = await response.json();
        if (response.status !== 200) throw new Error(json.message);
        return json;
      },
    },
  });

  const items = ref([]);

  async function getAll() {
    const response = await defaultInstance.Get('/api/user', { headers }).send();
    this.items = response;

    return response;
  }

  async function create(body) {
    const response = await defaultInstance.Post('/api/user', body, {
      'Content-Type': 'application/json;charset=UTF-8',
    }).send();

    return response;
  }

  async function update(body) {
    const response = await defaultInstance.Put(`/api/user/${body._id}`, body, { headers }).send();
    const index = this.items.findIndex((v) => v._id === response._id);
    Object.assign(this.items[index], response);

    return response;
  }

  async function remove(body) {
    const response = await defaultInstance.Post('/api/user/remove', body, { headers }).send();

    await Promise.all(
      response.map((v1) => {
        const index = this.items.findIndex((v2) => v2._id === v1._id);
        this.items.splice(index, 1);
        return true;
      }),
    );

    return response;
  }

  return {
    items, getAll, create, update, remove,
  };
});

export default useUserStore;
