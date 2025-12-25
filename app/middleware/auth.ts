export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    if (authStore.token && to.path === '/') {
        return navigateTo('/bookings');
    }

    if (!authStore.token && to.path !== '/') {
        return navigateTo('/');
    }
});