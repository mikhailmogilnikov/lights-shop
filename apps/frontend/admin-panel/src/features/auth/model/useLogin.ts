import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useSession } from '@/shared/model/session'
import { publicRqClient } from '@/shared/api/instance'

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

  const { mutate } = publicRqClient.useMutation('post', '/admin/auth/login', {
    onError: () => {
      form.setError('password', {
        message: 'Invalid email or password',
      })
    },
    onSuccess: (resp) => {
      form.reset()
      login(resp.token)
      navigate({ to: '/' })
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
