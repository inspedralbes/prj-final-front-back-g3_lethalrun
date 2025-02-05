<template>
    <header class="bg-white">
        <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <a href="#" class="-m-1.5 p-1.5">
                    <span class="sr-only">Your Company</span>
                    <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        alt="">
                </a>
            </div>
            <div class="flex flex-1 justify-end">
                <NuxtLink to="/auth/login" href="#" class="text-sm/6 font-semibold text-gray-900">Log in <span
                        aria-hidden="true">&rarr;</span></NuxtLink>
            </div>
        </nav>
    </header>

</template>