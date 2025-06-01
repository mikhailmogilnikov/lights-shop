import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { rqClient } from '@/shared/api'
import { useSession } from '@/shared/model/session'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormSchema = z.infer<typeof formSchema>

export const useLogin = () => {
  const { login } = useSession()
  const navigate = useNavigate()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate } = rqClient.useMutation('post', '/admin/auth/login', {
    onError: () => {
      form.setError('password', {
        message: 'Invalid email or password',
      })
    },
    onSuccess: (resp) => {
      if (resp.token) {
        form.reset()
        login(resp.token)
        setTimeout(() => {
          navigate({ to: '/' })
        }, 300)
      }
    },
  })

  const onSubmit = (data: FormSchema) => {
    mutate({
      body: {
        email: data.email,
        password: data.password,
      },
    })
  }

  return { form, onSubmit }
}
